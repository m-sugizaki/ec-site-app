import { browser, protractor, Key } from 'protractor';
import { CommonFuns } from '../../testutils/common.functions';
import { LoginPage } from '../../pageobjects/login.po';
import { ResponsePromise } from 'protractor-http-client/dist/promisewrappers';
import { MySQLDB } from '../../testutils/mysql.db';
import { UserInfoUpdateDialogPage } from '../../pageobjects/userinfoupdatedialog.po';
import { PaymentMethodPage } from '../../pageobjects/paymentmethod.po';
import { ShippingAddressDialogPage } from '../../pageobjects/shippingaddress';
import { async } from '@angular/core/testing';
import { UserInfoPage } from '../../pageobjects/userinfo.po';

describe('ECサイト User Info Update Dialog', () => {
    let page: UserInfoUpdateDialogPage;
    let cmnFuncs: CommonFuns;
    let pathOfImage: string;
    let pageLogin: LoginPage;
    let mySQLDB: MySQLDB;
    let pagePayment: PaymentMethodPage;
    let pageShipping: ShippingAddressDialogPage;
    let pageUserInfo : UserInfoPage

    beforeAll(() => {
        browser.driver.manage().window().maximize();
        pageLogin = new LoginPage();
        page = new UserInfoUpdateDialogPage();
        pagePayment = new PaymentMethodPage();
        pageShipping = new ShippingAddressDialogPage();
        pageUserInfo = new UserInfoPage();
        cmnFuncs = new CommonFuns();
        mySQLDB = new MySQLDB();
        pathOfImage = cmnFuncs.getRootEvidenceFolderName() + '\\userinfoupdatedialog';
        cmnFuncs.initEvidenceFolder(pathOfImage);

        //データ準備
        cmnFuncs.createUserForTest();
        var dataPaymentMethod = {
            user_id: browser.params.userForTest,
            payment_no: 1,
            payment_method: 'JCBカード',
            card_number: '1111-1111-1111-1111',
            card_holder_name: 'テストユーザー',
            expiration_date: '2020-01-01'
        }
        var dataShipping = {
            user_id: browser.params.userForTest,
            shipping_address_no: 1,
            postal_code: '111-1111',
            address1: '都道府県、市町村、丁目番地',
            address2: 'ビル、マンション',
            phone_number: '09112-4952-7644',
            shipping_address_name: 'テストユーザのお届け先名'
        }
        mySQLDB.executeSQLSync("DELETE FROM payment_method WHERE user_id = '" + browser.params.userForTest + "'");
        mySQLDB.executeSQLSync("DELETE FROM shipping_address WHERE user_id = '" + browser.params.userForTest + "'");
        mySQLDB.executeSQLWithParams('INSERT INTO payment_method SET ?', dataPaymentMethod);
        mySQLDB.executeSQLWithParams('INSERT INTO shipping_address SET ?', dataShipping);
    })

    afterAll (() => {
      pageLogin.navigateTo();
      browser.waitForAngular();
      pageLogin.getButtonLogOut().click();
    });

    it('Check Load Data User Info For Update Dialog', async () => {
        var EC = protractor.ExpectedConditions;

        page.navigateTo();
        browser.waitForAngular();
        pageLogin.getButtonOpenLoginDialog().click();
        browser.waitForAngular();
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image1.png');
        });
        pageLogin.getUsername().clear();
        pageLogin.getUsername().click();
        pageLogin.getUsername().sendKeys(browser.params.userForTest);
        cmnFuncs.waitForSendKeysAngular();
        pageLogin.getPassword().clear();
        pageLogin.getPassword().click();
        pageLogin.getPassword().sendKeys(browser.params.passwordOfUserForTest);
        cmnFuncs.waitForSendKeysAngular();
        browser.waitForAngular();
        pageLogin.getSubmitButton().click();
        browser.waitForAngular();
        browser.waitForAngularEnabled();
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image2.png');
        });
        let response: ResponsePromise = cmnFuncs.getDataFromRestAPI("/user/getUserInfoByUserIdList/" + browser.params.userForTest)
        let result2: any = await cmnFuncs.getJsonDataFromJsonBodyOfResponsePromise(response.jsonBody);
        page.getButtonMenuUserInfo().click();
        browser.waitForAngular();
        browser.waitForAngularEnabled();
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image3.png');
        });
        page.getButtonOpenDialogUpdateUserInfo().click();
        browser.waitForAngular();
        expect(page.getTitleDialogUpdateUserInfo()).toEqual('アカウント情報更新');
        expect(page.getUserId().getAttribute('value')).toEqual(browser.params.userForTest);
        expect(page.getName().getAttribute('value')).toEqual(result2[0].name);
        expect(page.getNickname().getAttribute('value')).toEqual(result2[0].nickname);
        expect(page.getPostalCode().getAttribute('value')).toEqual(result2[0].postalCode);
        expect(page.getAddress1().getAttribute('value')).toEqual(result2[0].address1);
        expect(page.getAddress2().getAttribute('value')).toEqual(result2[0].address2);
        expect(page.getPhoneNumber().getAttribute('value')).toEqual(result2[0].phoneNumber);
        expect(page.getEmail().getAttribute('value')).toEqual(result2[0].email);
        expect(page.getBirthday().getAttribute('value')).toEqual(cmnFuncs.formatYYYYMMDD(result2[0].birthday));
        expect(page.getMemberRank().getAttribute('value')).toEqual(result2[0].memberRank);

        let responsePayment = cmnFuncs.getDataFromRestAPI('paymentmethod/getPaymentMethodInfoByUserID/' + browser.params.userForTest);
        let resultPayment: any = await cmnFuncs.getJsonDataFromJsonBodyOfResponsePromise(responsePayment.jsonBody);

        let responseShipping = cmnFuncs.getDataFromRestAPI('shippingaddress/getShippingAddressInfoByUserID/' + browser.params.userForTest);
        let resultShipping: any = await cmnFuncs.getJsonDataFromJsonBodyOfResponsePromise(responseShipping.jsonBody);

        page.getCountTrTablePayment().then((value: any) => {
            expect(value.length).toBe(resultPayment.length);
        })
        for (let i = 0; i < resultPayment.length; i++) {
            expect(page.getDataTdPayment(i + 1, 1)).toEqual(resultPayment[i].primaryKey.paymentNo + '');
            expect(page.getDataTdPayment(i + 1, 2)).toEqual(resultPayment[i].paymentMethod);
            expect(page.getDataTdPayment(i + 1, 3)).toEqual(resultPayment[i].cardNumber);
            expect(page.getDataTdPayment(i + 1, 4)).toEqual(cmnFuncs.formatMonthYear(resultPayment[i].expirationDate));
            expect(page.getDataTdPayment(i + 1, 5)).toEqual(resultPayment[i].cardHolderName);
        }

        page.getCountTrTableShipping().then((value: any) => {
            expect(value.length).toEqual(resultShipping.length);
        })
        for (let i = 0; i < resultShipping.length; i++) {
            expect(page.getDataTdshipping(i + 1, 1)).toEqual(resultShipping[i].primaryKey.shippingAddressNo + '');
            expect(page.getDataTdshipping(i + 1, 2)).toEqual(resultShipping[i].postalCode);
            expect(page.getDataTdshipping(i + 1, 3)).toEqual(resultShipping[i].address1);
            expect(page.getDataTdshipping(i + 1, 4)).toEqual(resultShipping[i].address2);
            expect(page.getDataTdshipping(i + 1, 5)).toEqual(resultShipping[i].phoneNumber);
            expect(page.getDataTdshipping(i + 1, 6)).toEqual(resultShipping[i].shippingAddressName);
        }
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image4.png');
        });

        page.getButtonOpenDialogPayment().click();
        browser.waitForAngular();
        expect(page.getTitleDialogPayment()).toEqual('支払い方法情報登録');
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image5.png');
        });
        page.getButtonCancleDialogPayment().click();
        browser.waitForAngular();
        browser.wait(EC.elementToBeClickable(page.getButtonOpenDialogPaymentUpdate()), 5000);

        page.getButtonOpenDialogPaymentUpdate().click();
        browser.waitForAngular();
        expect(page.getTitleDialogPaymentUpdate()).toEqual('支払い方法情報更新')
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image6.png');
        });
        page.getButtonCancleDialogPaymentUpdate().click();
        browser.waitForAngular();
        browser.wait(EC.elementToBeClickable(page.getButtonOpenDialogDeletePayment()), 5000);
        page.getButtonOpenDialogDeletePayment().click();
        browser.waitForAngular();
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image7.png');
        });
        page.getButtonCancleDialogDeletePayment().click();
        browser.waitForAngular();
        browser.wait(EC.elementToBeClickable(page.getButtonOpenDialogShipping()), 5000);

        page.getButtonOpenDialogShipping().click();
        browser.waitForAngular();
        expect(page.getTitleDialogShipping()).toEqual('お届け先情報登録');
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image8.png');
        });
        page.getButtonCancleDialogShipping().click();
        browser.waitForAngular();
        browser.wait(EC.elementToBeClickable(page.getButtonOpenDialogUpdateShipping()), 5000);
        page.getButtonOpenDialogUpdateShipping().click();
        browser.waitForAngular();
        expect(page.getTitleDialogShippingUpdate()).toEqual('お届け先情報更新');
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image9.png');
        });
        page.getButtonCancleDialogUpdateShipping().click();
        browser.waitForAngular();
        browser.wait(EC.elementToBeClickable(page.getButtonOpenDialogDeleteShipping()), 5000);
        page.getButtonOpenDialogDeleteShipping().click();
        browser.waitForAngular();
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image10.png');
        });
        page.getButtonCancleDialogDeleteShipping().click();
    })

    it('Check Input Data Valid For Update Dialog', async () => {
        var EC = protractor.ExpectedConditions;
        browser.wait(EC.elementToBeClickable(page.getName()),5000);
        page.getName().click();
        page.getName().clear();
        browser.waitForAngular();
        page.getName().sendKeys('テ');
        page.getName().sendKeys(Key.BACK_SPACE);
        browser.waitForAngular();
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image11.png');
        });
        page.getButtonSubmit().click();
        browser.waitForAngular();
        //browser.wait(EC.presenceOf(page.getMessageErrorObj()), 5000);
        expect(page.getMessageError()).toEqual('氏名 を入力してください。');
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image12.png');
        });
        page.getName().sendKeys('CSV TEST');
        browser.waitForAngular();

        page.getNickname().click();
        page.getNickname().clear();
        browser.waitForAngular();
        page.getNickname().sendKeys('テ');
        page.getNickname().sendKeys(Key.BACK_SPACE);
        browser.waitForAngular();
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image13.png');
        });
        page.getButtonSubmit().click();
        browser.waitForAngular();
        expect(page.getMessageError()).toEqual('ﾆｯｸﾈｰﾑ を入力してください。');
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image14.png');
        });
        page.getNickname().sendKeys('CSV TEST');
        browser.waitForAngular();

        page.getAddress1().click();
        page.getAddress1().clear();
        browser.waitForAngular();
        page.getAddress1().sendKeys('テ');
        page.getAddress1().sendKeys(Key.BACK_SPACE);
        browser.waitForAngular();
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image15.png');
        });
        page.getButtonSubmit().click();
        browser.waitForAngular();
        expect(page.getMessageError()).toEqual('住所1 を入力してください。');
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image16.png');
        });
        page.getAddress1().sendKeys('都道府県、市町村、丁目番地');
        browser.waitForAngular();

        page.getPostalCode().click();
        page.getPostalCode().clear();
        browser.waitForAngular();
        page.getPostalCode().sendKeys('1');
        page.getPostalCode().sendKeys(Key.BACK_SPACE);
        browser.waitForAngular();
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image17.png');
        });
        page.getButtonSubmit().click();
        browser.waitForAngular();
        expect(page.getMessageError()).toEqual('郵便番号 を入力してください。');
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image18.png');
        });
        page.getPostalCode().sendKeys('111-1111');
        browser.waitForAngular();

        page.getPhoneNumber().click();
        page.getPhoneNumber().clear();
        browser.waitForAngular();
        page.getPhoneNumber().sendKeys('1');
        page.getPhoneNumber().sendKeys(Key.BACK_SPACE);
        browser.waitForAngular();
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image19.png');
        });
        page.getButtonSubmit().click();
        browser.waitForAngular();
        expect(page.getMessageError()).toEqual('電話番号 を入力してください。');
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image20.png');
        });
        page.getPhoneNumber().sendKeys('1');
        browser.waitForAngular();

        page.getEmail().click();
        page.getEmail().clear();
        browser.waitForAngular();
        page.getEmail().sendKeys('t');
        page.getEmail().sendKeys(Key.BACK_SPACE);
        browser.waitForAngular();
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image21.png');
        });
        page.getButtonSubmit().click();
        browser.waitForAngular();
        expect(page.getMessageError()).toEqual('E-mail を入力してください。');
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image22.png');
        });
        page.getEmail().sendKeys('csvtest@gmail.com');
        browser.waitForAngular();

        page.getMemberRank().clear();
        browser.waitForAngular();
        page.getMemberRank().sendKeys('一');
        page.getMemberRank().sendKeys(Key.BACK_SPACE);
        browser.waitForAngular();
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image23.png');
        });
        page.getButtonSubmit().click();
        browser.waitForAngular();
        expect(page.getMessageError()).toEqual('会員ﾗﾝｸ を入力してください。');
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image24.png');
        });
        page.getMemberRank().sendKeys('一般');
        browser.waitForAngular();

        page.getBirthday().clear();
        browser.waitForAngular();
        page.getBirthday().sendKeys('2');
        page.getBirthday().sendKeys(Key.BACK_SPACE);
        browser.waitForAngular();
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image25.png');
        });
        page.getButtonSubmit().click();
        browser.waitForAngular();
        expect(page.getMessageError()).toEqual('生年月日 を入力してください。');
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image26.png');
        });
        page.getBirthday().sendKeys('1988/04/05');
        browser.waitForAngular();

        page.getPostalCode().click();
        page.getPostalCode().clear();
        browser.waitForAngular();
        page.getPostalCode().sendKeys('11111-1');
        browser.waitForAngular();
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image27.png');
        });
        page.getButtonSubmit().click();
        browser.waitForAngular();
        expect(page.getMessageError()).toEqual('郵便番号のフォーマットが正しくないです。');
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image28.png');
        });
        page.getPostalCode().clear();
        page.getPostalCode().sendKeys('111-1111');
        browser.waitForAngular();

        page.getPhoneNumber().click();
        page.getPhoneNumber().clear();
        browser.waitForAngular();
        page.getPhoneNumber().sendKeys('1111111-111-111');
        browser.waitForAngular();
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image29.png');
        });
        page.getButtonSubmit().click();
        browser.waitForAngular();
        expect(page.getMessageError()).toEqual('電話番号のフォーマットが正しくないです。');
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image30.png');
        });
        page.getPhoneNumber().clear();
        page.getPhoneNumber().sendKeys('11111-1111-1111');
        browser.waitForAngular();

        page.getEmail().click();
        page.getEmail().clear();
        browser.waitForAngular();
        page.getEmail().sendKeys('csvtestgamail.com');
        browser.waitForAngular();
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image31.png');
        });
        page.getButtonSubmit().click();
        browser.waitForAngular();
        expect(page.getMessageError()).toEqual('Emailのフォーマットが正しくないです。');
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image32.png');
        });
        page.getEmail().clear();
        page.getEmail().sendKeys('csvtest@gmail.com');
        browser.waitForAngular();

        page.getBirthday().click();
        page.getBirthday().clear();
        browser.waitForAngular();
        page.getBirthday().sendKeys('20199/111');
        browser.waitForAngular();
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image33.png');
        });
        page.getButtonSubmit().click();
        browser.waitForAngular();
        expect(page.getMessageError()).toEqual('日付のフォーマットが正しくないです。');
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image34.png');
        });
        page.getBirthday().clear();
        page.getBirthday().sendKeys('1988/04/05');
        browser.waitForAngular();
        browser.wait(EC.elementToBeClickable(page.getName()), 5000);
    })

    it('Run Update User Info by Valid Data', async () => {
        let userUpdate = {
            address1: "都道府県、市町村、丁目番地 112",
            address2: "ビル、マンション 112",
            birthday: "1988/05/05",
            email: "csvtest2@gmail.com",
            memberRank: "一般",
            name: "CSV TEST 2",
            nickname: "CSV TEST 2",
            phoneNumber: "1122-1111-1111",
            postalCode: "222-1111",
        }

        page.getName().click();
        page.getName().clear();
        browser.waitForAngular();
        page.getName().sendKeys(userUpdate.name);
        browser.waitForAngular();
        page.getNickname().clear();
        browser.waitForAngular();
        page.getNickname().sendKeys(userUpdate.nickname);
        browser.waitForAngular();
        page.getPostalCode().clear();
        browser.waitForAngular();
        page.getPostalCode().sendKeys(userUpdate.postalCode);
        browser.waitForAngular();
        page.getAddress1().clear();
        browser.waitForAngular();
        page.getAddress1().sendKeys(userUpdate.address1);
        browser.waitForAngular();
        page.getAddress2().clear();
        browser.waitForAngular();
        page.getAddress2().sendKeys(userUpdate.address2);
        browser.waitForAngular();
        page.getEmail().clear();
        browser.waitForAngular();
        page.getEmail().sendKeys(userUpdate.email);
        browser.waitForAngular();
        page.getPhoneNumber().clear();
        browser.waitForAngular();
        page.getPhoneNumber().sendKeys(userUpdate.phoneNumber);
        browser.waitForAngular();
        page.getBirthday().clear();
        browser.waitForAngular();
        page.getBirthday().sendKeys(userUpdate.birthday);
        browser.waitForAngular();
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image35.png');
        });
        //update payment
        page.getButtonOpenDialogPaymentUpdate().click();
        browser.waitForAngular();
        let responsePayment = cmnFuncs.getDataFromRestAPI('paymentmethod/getPaymentMethodInfoByUserID/' + browser.params.userForTest);
        let resultPayment: any = await cmnFuncs.getJsonDataFromJsonBodyOfResponsePromise(responsePayment.jsonBody);
        expect(page.getTitleDialogPaymentUpdate()).toEqual('支払い方法情報更新');
        let dataPaymentMethodUpdate = {
            user_id: browser.params.userForTest,
            payment_no: 1,
            payment_method: '銀行振込みテスト',
            card_number: '1111-1111-2222-2222',
            card_holder_name: 'テストユーザーああ',
            expiration_date: '2020-01-01',
            month: '04'
        }

        pagePayment.getPaymentMethodUpdate().click();
        pagePayment.getPaymentMethodUpdate().clear();
        browser.waitForAngular();
        pagePayment.getPaymentMethodUpdate().sendKeys(dataPaymentMethodUpdate.payment_method);
        browser.waitForAngular();
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image36.png');
        });

        pagePayment.getCardNumberUpdate().click();
        pagePayment.getCardNumberUpdate().clear();
        browser.waitForAngular();
        pagePayment.getCardNumberUpdate().sendKeys(dataPaymentMethodUpdate.card_number);
        browser.waitForAngular();
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image37.png');
        });
        browser.waitForAngular();

        pagePayment.getHolderName().click();
        pagePayment.getHolderName().clear();
        browser.waitForAngular();
        pagePayment.getHolderName().sendKeys(dataPaymentMethodUpdate.card_holder_name);
        browser.waitForAngular();
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image38.png');
        });
        browser.waitForAngular();

        pagePayment.getSelectMonth().click()
        browser.waitForAngular();
        pagePayment.getOpionSelect(4).click();
        browser.waitForAngular();
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image39.png');
        });

        pagePayment.getSelectYear().click()
        browser.waitForAngular();
        pagePayment.getOpionSelect(3).click();
        browser.waitForAngular();
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image40.png');
        });
        let year;
        await pagePayment.getYear().then(async (value) => {
            year = value;
        })

        pagePayment.getButtonSubmitUpdatePayMent().click();
        browser.waitForAngular();
        browser.waitForAngularEnabled();

        let responsePaymentAfter = cmnFuncs.getDataFromRestAPI('paymentmethod/getPaymentMethodInfoByUserID/' + browser.params.userForTest);
        let resultPaymentAfter: any = await cmnFuncs.getJsonDataFromJsonBodyOfResponsePromise(responsePaymentAfter.jsonBody);

        expect(resultPaymentAfter[0].primaryKey.userId).toEqual(browser.params.userForTest);
        expect(resultPaymentAfter[0].primaryKey.paymentNo).toBe(dataPaymentMethodUpdate.payment_no);
        expect(resultPaymentAfter[0].paymentMethod).toEqual(dataPaymentMethodUpdate.payment_method);
        expect(resultPaymentAfter[0].cardNumber).toEqual(dataPaymentMethodUpdate.card_number);
        expect(resultPaymentAfter[0].cardHolderName).toEqual(dataPaymentMethodUpdate.card_holder_name);
        let dateafter = new Date(resultPaymentAfter[0].expirationDate);
        expect(year).toEqual(dateafter.getFullYear() + '');
        expect(dataPaymentMethodUpdate.month).toEqual(cmnFuncs.checkSmallerThan10(dateafter.getMonth() + 1) + '');

        page.getCountTrTablePayment().then((value: any) => {
            expect(value.length).toBe(resultPaymentAfter.length);
        });
        for (let i = 0; i < resultPayment.length; i++) {
            expect(page.getDataTdPayment(i + 1, 1)).toEqual(resultPaymentAfter[i].primaryKey.paymentNo + '');
            expect(page.getDataTdPayment(i + 1, 2)).toEqual(resultPaymentAfter[i].paymentMethod);
            expect(page.getDataTdPayment(i + 1, 3)).toEqual(resultPaymentAfter[i].cardNumber);
            expect(page.getDataTdPayment(i + 1, 4)).toEqual(cmnFuncs.formatMonthYear(resultPaymentAfter[i].expirationDate));
            expect(page.getDataTdPayment(i + 1, 5)).toEqual(resultPaymentAfter[i].cardHolderName);
        }

        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image41.png');
        });
        page.getButtonOpenDialogUpdateShipping().click();
        browser.waitForAngular();
        let userId = browser.params.userForTest;
        let phoneNumber = '1111-111-1111';
        let shippingNo: any;
        shippingNo = await pageShipping.getShippingAddressNoFromDialogUpdate();
        shippingNo = parseInt(shippingNo);
        pageShipping.getPhoneNumberFromDialogUpdate().clear();
        browser.waitForAngular();
        browser.waitForAngularEnabled()
        pageShipping.getPhoneNumberFromDialogUpdate().click();
        browser.waitForAngular();
        pageShipping.getPhoneNumberFromDialogUpdate().sendKeys(phoneNumber);
        browser.waitForAngular();
        browser.waitForAngularEnabled()

        pageShipping.getPostalCodeFromDialogUpdate().clear();
        browser.waitForAngular();
        browser.waitForAngularEnabled()
        pageShipping.getPostalCodeFromDialogUpdate().click();
        browser.waitForAngular();
        pageShipping.getPostalCodeFromDialogUpdate().sendKeys('222-2222');
        browser.waitForAngular();
        browser.waitForAngularEnabled()

        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image42.png');
        });
        pageShipping.getSubmitButtonFromDialogUpdate().click();
        browser.waitForAngular();
        browser.waitForAngularEnabled();

        let response2: ResponsePromise = cmnFuncs.getDataFromRestAPI(`/shippingaddress/getShippingAddressInfoByKey/${userId}/${shippingNo}`)
        let result2: any = await cmnFuncs.getJsonDataFromJsonBodyOfResponsePromise(response2.jsonBody);
        expect(pageShipping.getDataTD(1, 2)).toEqual(result2.postalCode);
        expect(pageShipping.getDataTD(1, 3)).toEqual(result2.address1);
        expect(pageShipping.getDataTD(1, 4)).toEqual(result2.address2);
        expect(pageShipping.getDataTD(1, 5)).toEqual(result2.phoneNumber);
        expect(pageShipping.getDataTD(1, 6)).toEqual(result2.shippingAddressName);
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image43.png');
        });
        page.getButtonSubmit().click();
        browser.waitForAngular();
        browser.waitForAngularEnabled();

        let response: ResponsePromise = cmnFuncs.getDataFromRestAPI("/user/getUserInfoByUserIdList/" + browser.params.userForTest)
        let result: any = await cmnFuncs.getJsonDataFromJsonBodyOfResponsePromise(response.jsonBody);

        expect(result[0].primaryKey.userId).toEqual(browser.params.userForTest);
        expect(result[0].name).toEqual(userUpdate.name);
        expect(result[0].address1).toEqual(userUpdate.address1);
        expect(result[0].address2).toEqual(userUpdate.address2);
        expect(cmnFuncs.formatYYYYMMDD(result[0].birthday)).toEqual(userUpdate.birthday);
        expect(result[0].email).toEqual(userUpdate.email);
        expect(result[0].memberRank).toEqual(userUpdate.memberRank);
        expect(result[0].nickname).toEqual(userUpdate.nickname);
        expect(result[0].phoneNumber).toEqual(userUpdate.phoneNumber);
        expect(result[0].postalCode).toEqual(userUpdate.postalCode);
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image44.png');
        });
    })

    it('Check Data after Update User Info',async()=>{

        let value = browser.executeScript("return window.localStorage.getItem('token');");
        let result = await cmnFuncs.getJsonDataFromJsonBodyOfResponsePromise(value);

        let response = cmnFuncs.getDataFromRestAPI('user/'+result);
        let userInfo : any = await cmnFuncs.getJsonDataFromJsonBodyOfResponsePromise(response.jsonBody);

        let responsePayment = cmnFuncs.getDataFromRestAPI('paymentmethod/getPaymentMethodInfoByUserID/' + userInfo.primaryKey.userId);
        let payment : any = await cmnFuncs.getJsonDataFromJsonBodyOfResponsePromise(responsePayment.jsonBody);

        let responseShipping = cmnFuncs.getDataFromRestAPI('shippingaddress/getShippingAddressInfoByUserID/' + userInfo.primaryKey.userId);
        let shipping :any = await cmnFuncs.getJsonDataFromJsonBodyOfResponsePromise(responseShipping.jsonBody);

        expect(pageUserInfo.getUserId()).toEqual(userInfo.primaryKey.userId);
        expect(pageUserInfo.getName()).toEqual(userInfo.name);
        expect(pageUserInfo.getNickName()).toEqual(userInfo.nickname);
        expect(pageUserInfo.getPostalCode()).toEqual(userInfo.postalCode);
        expect(pageUserInfo.getAddress1()).toEqual(userInfo.address1);
        expect(pageUserInfo.getAddress2()).toEqual(userInfo.address2);
        expect(pageUserInfo.getPhoneNumber()).toEqual(userInfo.phoneNumber);
        expect(pageUserInfo.getEmail()).toEqual(userInfo.email);
        expect(pageUserInfo.getBirthday()).toEqual(cmnFuncs.formatYYYYMMDD(userInfo.birthday));
        expect(pageUserInfo.getMemberRank()).toEqual(userInfo.memberRank);

        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image45.png');
        });

        pageUserInfo.getPaymentCountTr().then((value : any) => {
            expect(value.length).toBe(payment.length);
        })
        for(let i =0; i< payment.length ; i++){
            expect(pageUserInfo.getPaymentTd(i+1, 1).getText()).toEqual(payment[i].primaryKey.paymentNo + '');
            expect(pageUserInfo.getPaymentTd(i+1, 2).getText()).toEqual(payment[i].paymentMethod);
            expect(pageUserInfo.getPaymentTd(i+1, 3).getText()).toEqual(payment[i].cardNumber);
            expect(pageUserInfo.getPaymentTd(i+1, 4).getText()).toEqual(cmnFuncs.formatMonthYear(payment[i].expirationDate));
            expect(pageUserInfo.getPaymentTd(i+1, 5).getText()).toEqual(payment[i].cardHolderName);
        }

        pageUserInfo.getShippingCountTr().then((value : any) => {
            expect(value.length).toBe(shipping.length);
        })
        for(let i  = 0; i < shipping.length ; i++){
            expect(pageUserInfo.getShippingTd(i+1,1).getText()).toEqual(shipping[i].primaryKey.shippingAddressNo + '');
            expect(pageUserInfo.getShippingTd(i+1,2).getText()).toEqual(shipping[i].postalCode);
            expect(pageUserInfo.getShippingTd(i+1,3).getText()).toEqual(shipping[i].address1);
            expect(pageUserInfo.getShippingTd(i+1,4).getText()).toEqual(shipping[i].address2);
            expect(pageUserInfo.getShippingTd(i+1,5).getText()).toEqual(shipping[i].phoneNumber);
            expect(pageUserInfo.getShippingTd(i+1,6).getText()).toEqual(shipping[i].shippingAddressName);
        }

    })

})
