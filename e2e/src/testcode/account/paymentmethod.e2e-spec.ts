import { browser, logging, Key, protractor } from 'protractor';
import { CommonFuns } from '../../testutils/common.functions';
import { LoginPage } from '../../pageobjects/login.po';
import { MySQLDB } from '../../testutils/mysql.db';
import { UserInfoPage } from '../../pageobjects/userinfo.po';
import { PaymentMethodPage } from '../../pageobjects/paymentmethod.po';
import { UserInfoUpdateDialogPage } from '../../pageobjects/userinfoupdatedialog.po';
import { SignUpPage } from '../../pageobjects/signup.po';
import { UserInfoDialogPage } from '../../pageobjects/userinfodialog.po';
import { ProductDetailPage } from '../../pageobjects/productdetail.po';
import { ProductSearchPage } from '../../pageobjects/productSearch.po';
import { ProductCartBuyDialogPage } from '../../pageobjects/productcartbuydialog.po';
describe('ECサイト Payment Method', () => {
    let page: PaymentMethodPage;
    let loginPage: LoginPage;
    let userInfoPage: UserInfoPage;
    let cmnFuncs: CommonFuns;
    let pathOfImage: string;
    let mySQLDB: MySQLDB;
    let userInfoUpdatePage: UserInfoUpdateDialogPage;
    let signUpPage: SignUpPage;
    let pageUserInfoDialog: UserInfoDialogPage;
    let pageDetail: ProductDetailPage;
    let pageSearch: ProductSearchPage;
    let pageCheckout: ProductCartBuyDialogPage;

    beforeAll(() => {
        browser.driver.manage().window().maximize();
        loginPage = new LoginPage();
        page = new PaymentMethodPage();
        userInfoPage = new UserInfoPage();
        pageDetail = new ProductDetailPage();
        pageSearch = new ProductSearchPage();
        pageCheckout = new ProductCartBuyDialogPage();
        cmnFuncs = new CommonFuns();
        mySQLDB = new MySQLDB();
        userInfoUpdatePage = new UserInfoUpdateDialogPage();
        signUpPage = new SignUpPage();
        pageUserInfoDialog = new UserInfoDialogPage();
        pathOfImage = cmnFuncs.getRootEvidenceFolderName() + '\\paymentmethod';
        cmnFuncs.initEvidenceFolder(pathOfImage);

        //データ準備
        cmnFuncs.createUserForTest();
        var dataPaymentMethod = {
            user_id: browser.params.userForTest,
            payment_no: 1,
            payment_method: '銀行振込み',
            card_number: '1111-1111-1111-1111',
            card_holder_name: 'テストユーザー',
            expiration_date: '2020-01-01'
        }
        var path = require('path');
        var fs = require("fs");
        var imgPath = path.resolve(__dirname, '../../testutils/imgs/imagetest.png');
        var imgVal = fs.readFileSync(imgPath);
        var data1 = {
            product_id: 'TEST100001',
            product_name: 'B4モバイルノート GSX400R',
            maker: 'PC工房',
            price: 128000,
            size: 'XL,X,M',
            color: 'Black,White,Silver',
            sale_point: '格安ハイスペックPC！ 普段使いにストレスを感じさせません！！！',
            image: imgVal,
            stock_quantity: 99,
            similar_product_id: 'TEST101001,TEST10002'
        }
        var data2 = {
            product_id: 'TEST101001',
            product_name: '5G対応 6.5型大画面スマートフォン RVG250',
            maker: 'PC工房',
            price: 98000,
            size: '',
            color: '白',
            sale_point: '先行発売！ ハンドメイドのため台数限定です。お申し込みはお早めに！！！',
            image: imgVal,
            stock_quantity: 200,
            similar_product_id: 'TEST101002,TEST101003'
        }
        mySQLDB.executeSQLSync("DELETE FROM product");
        mySQLDB.executeSQLSync("DELETE FROM payment_method WHERE user_id = '" + browser.params.userForTest + "'");
        mySQLDB.executeSQLWithParams('INSERT INTO payment_method SET ?', dataPaymentMethod);
        mySQLDB.executeSQLWithParams('INSERT INTO product SET ?', data1);
        mySQLDB.executeSQLWithParams('INSERT INTO product SET ?', data2);
    });

    afterAll (() => {
      loginPage.navigateTo();
      browser.waitForAngular();
    });

    it('Check data valid_Payment method Update page', async () => {
        let userId = browser.params.userForTest;
        let password = browser.params.passwordOfUserForTest;
        var EC = protractor.ExpectedConditions;
        var condition = EC.elementToBeClickable(loginPage.getButtonOpenLoginDialog());

        loginPage.navigateTo();
        browser.wait(condition, 5000);

        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image1.png');
        });

        var condition = EC.elementToBeClickable(loginPage.getUsername());
        loginPage.getButtonOpenLoginDialog().click();
        browser.wait(condition, 5000);
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image2.png');
        });

        loginPage.getUsername().clear();
        loginPage.getUsername().click();
        loginPage.getUsername().sendKeys(userId);
        cmnFuncs.waitForSendKeysAngular();
        loginPage.getPassword().clear();
        loginPage.getPassword().click();
        loginPage.getPassword().sendKeys(password);
        cmnFuncs.waitForSendKeysAngular();
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image3.png');
        });
        loginPage.getSubmitButton().click();
        browser.waitForAngular();

        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image4.png');
        });
        userInfoPage.getButtonInfoMenu().click();
        browser.waitForAngular();
        browser.waitForAngularEnabled();
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image5.png');
        });
        userInfoPage.getButtonUpdateUserInfo().click();
        browser.waitForAngular();
        browser.waitForAngularEnabled();
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image6.png');
        });
        userInfoUpdatePage.getButtonOpenDialogPayment().click();
        browser.waitForAngular();
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image7.png');
        });
        page.getButtonSubmitAddPayment().click();
        browser.waitForAngular();
        expect(page.getMessageError()).toEqual('支払方法 を入力してください。');
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image8.png');
        });
        page.getPaymentMethod().sendKeys('銀行振込み');
        browser.waitForAngular();
        page.getButtonSubmitAddPayment().click();
        browser.waitForAngular();
        expect(page.getMessageError()).toEqual('ｶｰﾄﾞ番号 を入力してください。');
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image9.png');
        });
        page.getCardNumber().sendKeys('1111-1111-1111-1111');
        browser.waitForAngular();
        page.getButtonSubmitAddPayment().click();
        browser.waitForAngular();
        expect(page.getMessageError()).toEqual('ｶｰﾄﾞ名義人 を入力してください。');
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image10.png');
        });
        page.getOwnerName().sendKeys('テストユーザー');
        browser.waitForAngular();
        page.getCardNumber().clear();
        page.getCardNumber().sendKeys('111111111-111');
        browser.waitForAngular();
        page.getButtonSubmitAddPayment().click();
        browser.waitForAngular();
        expect(page.getMessageError()).toEqual('ｶｰﾄﾞ番号のフォーマットが正しくないです。');
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image11.png');
        });
        var condition = EC.elementToBeClickable(userInfoUpdatePage.getButtonOpenDialogPaymentUpdate());
        page.getButtonCancleAddPayment().click();
        browser.wait(condition, 5000);
    })

    it('Update Payment Method on User Info Update Dialog', async () => {
        userInfoUpdatePage.getButtonOpenDialogPaymentUpdate().click();
        browser.waitForAngular();
        let responsePayment = cmnFuncs.getDataFromRestAPI('paymentmethod/getPaymentMethodInfoByUserID/' + browser.params.userForTest);
        let resultPayment: any = await cmnFuncs.getJsonDataFromJsonBodyOfResponsePromise(responsePayment.jsonBody);

        expect(userInfoUpdatePage.getTitleDialogPaymentUpdate()).toEqual('支払い方法情報更新');
        expect(page.getUserId().getAttribute('value')).toEqual(browser.params.userForTest);
        expect(page.getPaymentNo().getAttribute('value')).toEqual(resultPayment[0].primaryKey.paymentNo + '');
        expect(page.getPaymentMethodUpdate().getAttribute('value')).toEqual(resultPayment[0].paymentMethod);
        expect(page.getCardNumberUpdate().getAttribute('value')).toEqual(resultPayment[0].cardNumber);
        expect(page.getHolderName().getAttribute('value')).toEqual(resultPayment[0].cardHolderName);
        let date = new Date(resultPayment[0].expirationDate);
        expect(page.getYear()).toEqual(date.getFullYear() + '');
        expect(page.getMonth()).toEqual(cmnFuncs.checkSmallerThan10(date.getMonth() + 1) + '');
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image12.png');
        });

        let dataPaymentMethodUpdate = {
            user_id: browser.params.userForTest,
            payment_no: 1,
            payment_method: '銀行振込みテスト',
            card_number: '1111-1111-2222-2222',
            card_holder_name: 'テストユーザーああ',
            expiration_date: '2020-01-01',
            month: '04'
        }

        page.getPaymentMethodUpdate().click();
        page.getPaymentMethodUpdate().clear();
        browser.waitForAngular();
        page.getPaymentMethodUpdate().sendKeys(dataPaymentMethodUpdate.payment_method);
        browser.waitForAngular();
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image13.png');
        });

        page.getCardNumberUpdate().click();
        page.getCardNumberUpdate().clear();
        browser.waitForAngular();
        page.getCardNumberUpdate().sendKeys(dataPaymentMethodUpdate.card_number);
        browser.waitForAngular();
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image14.png');
        });
        browser.waitForAngular();

        page.getHolderName().click();
        page.getHolderName().clear();
        browser.waitForAngular();
        page.getHolderName().sendKeys(dataPaymentMethodUpdate.card_holder_name);
        browser.waitForAngular();
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image15.png');
        });
        browser.waitForAngular();

        page.getSelectMonth().click()
        browser.waitForAngular();
        page.getOpionSelect(4).click();
        browser.waitForAngular();
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image16.png');
        });

        page.getSelectYear().click()
        browser.waitForAngular();
        page.getOpionSelect(3).click();
        browser.waitForAngular();
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image17.png');
        });
        let year;
        await page.getYear().then(async (value) => {
            year = value;
        })

        page.getButtonSubmitUpdatePayMent().click();
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

        userInfoUpdatePage.getCountTrTablePayment().then((value: any) => {
            expect(value.length).toBe(resultPaymentAfter.length);
        });
        for (let i = 0; i < resultPayment.length; i++) {
            expect(userInfoUpdatePage.getDataTdPayment(i + 1, 1)).toEqual(resultPaymentAfter[i].primaryKey.paymentNo + '');
            expect(userInfoUpdatePage.getDataTdPayment(i + 1, 2)).toEqual(resultPaymentAfter[i].paymentMethod);
            expect(userInfoUpdatePage.getDataTdPayment(i + 1, 3)).toEqual(resultPaymentAfter[i].cardNumber);
            expect(userInfoUpdatePage.getDataTdPayment(i + 1, 4)).toEqual(cmnFuncs.formatMonthYear(resultPaymentAfter[i].expirationDate));
            expect(userInfoUpdatePage.getDataTdPayment(i + 1, 5)).toEqual(resultPaymentAfter[i].cardHolderName);
        }

        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image18.png');
        });
    })

    it('Delete Payment Method on User Info Update Dialog', async () => {
        let responsePayment = cmnFuncs.getDataFromRestAPI('paymentmethod/getPaymentMethodInfoByUserID/' + browser.params.userForTest);
        let resultPayment: any = await cmnFuncs.getJsonDataFromJsonBodyOfResponsePromise(responsePayment.jsonBody);
        let deletePaymentNo : any;

        userInfoUpdatePage.getButtonOpenDialogDeletePayment().click();
        browser.waitForAngular();
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image19.png');
        });
        deletePaymentNo = await userInfoUpdatePage.getDataTdPayment(1, 1);
        page.getButtonSubmitDeletePayment().click();
        browser.waitForAngular();
        browser.waitForAngularEnabled();

        let responsePaymentAfter = cmnFuncs.getDataFromRestAPI('paymentmethod/getPaymentMethodInfoByUserID/' + browser.params.userForTest);
        let resultPaymentAfter: any = await cmnFuncs.getJsonDataFromJsonBodyOfResponsePromise(responsePaymentAfter.jsonBody);

        expect(resultPaymentAfter.length).toBeLessThan(resultPayment.length);
        userInfoUpdatePage.getCountTrTablePayment().then((value: any) => {
            expect(value.length).toBe(resultPaymentAfter.length);
        })
        for (let i = 0; i < resultPayment.length; i++) {
            expect(deletePaymentNo).toEqual(resultPayment[i].primaryKey.paymentNo + '');
        }
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image20.png');
        });
    })

    it('Add Payment Method on User Info Update Dialog', async () => {
        let responsePayment = cmnFuncs.getDataFromRestAPI('paymentmethod/getPaymentMethodInfoByUserID/' + browser.params.userForTest);
        let resultPayment: any = await cmnFuncs.getJsonDataFromJsonBodyOfResponsePromise(responsePayment.jsonBody);

        userInfoUpdatePage.getButtonOpenDialogPayment().click();
        browser.waitForAngular();
        expect(userInfoUpdatePage.getTitleDialogPayment()).toEqual('支払い方法情報登録');
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image21.png');
        });
        let dataPaymentMethod = {
            user_id: browser.params.userForTest,
            payment_method: '銀行振込み',
            card_number: '1111-1111-2222-2222',
            card_holder_name: 'テストユーザー',
            month: '04'
        }
        page.getPaymentMethod().sendKeys(dataPaymentMethod.payment_method);
        browser.waitForAngular();
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image22.png');
        });
        browser.waitForAngular();
        page.getCardNumber().sendKeys(dataPaymentMethod.card_number);
        browser.waitForAngular();
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image23.png');
        });
        browser.waitForAngular();
        page.getOwnerName().sendKeys(dataPaymentMethod.card_holder_name);
        browser.waitForAngular();
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image24.png');
        });
        browser.waitForAngular();
        page.getSelectMonthAdd().click()
        browser.waitForAngular();
        page.getOpionSelect(4).click();
        browser.waitForAngular();
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image25.png');
        });

        page.getSelectYearAdd().click()
        browser.waitForAngular();
        page.getOpionSelect(3).click();
        browser.waitForAngular();
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image26.png');
        });
        let year;
        await page.getYearAdd().then(async (value) => {
            year = value;
        })

        page.getButtonSubmitAddPayment().click();
        browser.waitForAngular();
        browser.waitForAngularEnabled();

        let responsePaymentAfter = cmnFuncs.getDataFromRestAPI('paymentmethod/getPaymentMethodInfoByUserID/' + browser.params.userForTest);
        let resultPaymentAfter: any = await cmnFuncs.getJsonDataFromJsonBodyOfResponsePromise(responsePaymentAfter.jsonBody);

        expect(resultPayment.length).toBeLessThan(resultPaymentAfter.length);
        expect(resultPaymentAfter[0].primaryKey.userId).toEqual(browser.params.userForTest);
        expect(resultPaymentAfter[0].paymentMethod).toEqual(dataPaymentMethod.payment_method);
        expect(resultPaymentAfter[0].cardNumber).toEqual(dataPaymentMethod.card_number);
        expect(resultPaymentAfter[0].cardHolderName).toEqual(dataPaymentMethod.card_holder_name);
        let dateafter = new Date(resultPaymentAfter[0].expirationDate);
        expect(year).toEqual(dateafter.getFullYear() + '');
        expect(dataPaymentMethod.month).toEqual(cmnFuncs.checkSmallerThan10(dateafter.getMonth() + 1) + '');

        userInfoUpdatePage.getCountTrTablePayment().then((value: any) => {
            expect(value.length).toBe(resultPaymentAfter.length);
        })
        for (let i = 0; i < resultPayment.length; i++) {
            expect(userInfoUpdatePage.getDataTdPayment(i + 1, 1)).toEqual(resultPaymentAfter[i].primaryKey.paymentNo + '');
            expect(userInfoUpdatePage.getDataTdPayment(i + 1, 2)).toEqual(resultPaymentAfter[i].paymentMethod);
            expect(userInfoUpdatePage.getDataTdPayment(i + 1, 3)).toEqual(resultPaymentAfter[i].cardNumber);
            expect(userInfoUpdatePage.getDataTdPayment(i + 1, 4)).toEqual(cmnFuncs.formatMonthYear(resultPaymentAfter[i].expirationDate));
            expect(userInfoUpdatePage.getDataTdPayment(i + 1, 5)).toEqual(resultPaymentAfter[i].cardHolderName);
        }

        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image27.png');
        });
    })

    it('Add Payment MeThod on Product Cart Buy Dialog', async () => {
        mySQLDB.executeSQLSync("DELETE FROM payment_method WHERE user_id = '" + browser.params.userForTest + "'");

        page.navigateTo();
        pageDetail.getButtonMenuSearch().click();
        browser.waitForAngular();
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image28.png');
        });
        pageSearch.getButtonSearch().click();
        browser.waitForAngular();
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image29.png');
        });
        pageSearch.getButtonDetail().click();
        browser.waitForAngular();
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image30.png');
        });
        pageDetail.getButtonGoToCheckOut().click();
        browser.waitForAngular();
        expect(pageDetail.getTitleCheckoutDialog()).toEqual('商品購入');
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image31.png');
        });
        pageCheckout.getButtonSignupPaymentDialog().click();
        browser.waitForAngular();
        expect(userInfoUpdatePage.getTitleDialogPayment()).toEqual('支払い方法情報登録');
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image32.png');
        });
        let responsePayment = cmnFuncs.getDataFromRestAPI('paymentmethod/getPaymentMethodInfoByUserID/' + browser.params.userForTest);
        let resultPayment: any = await cmnFuncs.getJsonDataFromJsonBodyOfResponsePromise(responsePayment.jsonBody);

        let dataPaymentMethod = {
            user_id: browser.params.userForTest,
            payment_method: 'JCBカード',
            card_number: '1111-1111-2222-2222',
            card_holder_name: 'テストユーザー',
            month: '04'
        }
        page.getPaymentMethod().sendKeys(dataPaymentMethod.payment_method);
        browser.waitForAngular();
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image33.png');
        });
        browser.waitForAngular();
        page.getCardNumber().sendKeys(dataPaymentMethod.card_number);
        browser.waitForAngular();
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image34.png');
        });
        browser.waitForAngular();
        page.getOwnerName().sendKeys(dataPaymentMethod.card_holder_name);
        browser.waitForAngular();
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image35.png');
        });
        browser.waitForAngular();
        page.getSelectMonthAdd().click()
        browser.waitForAngular();
        page.getOpionSelect(4).click();
        browser.waitForAngular();
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image36.png');
        });

        page.getSelectYearAdd().click()
        browser.waitForAngular();
        page.getOpionSelect(3).click();
        browser.waitForAngular();
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image37.png');
        });
        let year;
        await page.getYearAdd().then(async (value) => {
            year = value;
        })

        page.getButtonSubmitAddPayment().click();
        browser.waitForAngular();

        let responsePaymentAfter = cmnFuncs.getDataFromRestAPI('paymentmethod/getPaymentMethodInfoByUserID/' + browser.params.userForTest);
        let resultPaymentAfter: any = await cmnFuncs.getJsonDataFromJsonBodyOfResponsePromise(responsePaymentAfter.jsonBody);

        expect(resultPayment.length).toBeLessThan(resultPaymentAfter.length);
        expect(resultPaymentAfter[0].primaryKey.userId).toEqual(browser.params.userForTest);
        expect(resultPaymentAfter[0].paymentMethod).toEqual(dataPaymentMethod.payment_method);
        expect(resultPaymentAfter[0].cardNumber).toEqual(dataPaymentMethod.card_number);
        expect(resultPaymentAfter[0].cardHolderName).toEqual(dataPaymentMethod.card_holder_name);
        let dateafter = new Date(resultPaymentAfter[0].expirationDate);
        expect(year).toEqual(dateafter.getFullYear() + '');
        expect(dataPaymentMethod.month).toEqual(cmnFuncs.checkSmallerThan10(dateafter.getMonth() + 1) + '');
        expect(pageCheckout.getSpanPaymentmethod()).toEqual(resultPaymentAfter[0].paymentMethod);
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image38.png');
        });
    })

    it('Update Payment Method on Product Cart Buy Dialog', async () => {
        let responsePayment = cmnFuncs.getDataFromRestAPI('paymentmethod/getPaymentMethodInfoByUserID/' + browser.params.userForTest);

        pageCheckout.getButtonUpdatePaymentDialog().click();
        browser.waitForAngular();
        expect(userInfoUpdatePage.getTitleDialogPaymentUpdate()).toEqual('支払い方法情報更新');
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image39.png');
        });

        let dataPaymentMethodUpdate = {
            user_id: browser.params.userForTest,
            payment_no: 1,
            payment_method: 'VASAカード',
            card_number: '2222-2222-2222-2222',
            card_holder_name: 'テストユーザー2',
            expiration_date: '2020-01-01',
            month: '05'
        }

        page.getPaymentMethodUpdate().click();
        page.getPaymentMethodUpdate().clear();
        browser.waitForAngular();
        page.getPaymentMethodUpdate().sendKeys(dataPaymentMethodUpdate.payment_method);
        browser.waitForAngular();
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image40.png');
        });
        browser.waitForAngular();

        page.getCardNumberUpdate().click();
        page.getCardNumberUpdate().clear();
        browser.waitForAngular();
        page.getCardNumberUpdate().sendKeys(dataPaymentMethodUpdate.card_number);
        browser.waitForAngular();
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image41.png');
        });
        browser.waitForAngular();

        page.getHolderName().click();
        page.getHolderName().clear();
        browser.waitForAngular();
        page.getHolderName().sendKeys(dataPaymentMethodUpdate.card_holder_name);
        browser.waitForAngular();
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image42.png');
        });
        browser.waitForAngular();

        page.getSelectMonth().click()
        browser.waitForAngular();
        page.getOpionSelect(5).click();
        browser.waitForAngular();
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\imag43.png');
        });

        page.getSelectYear().click()
        browser.waitForAngular();
        page.getOpionSelect(3).click();
        browser.waitForAngular();
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image44.png');
        });
        let year;
        await page.getYear().then(async (value) => {
            year = value;
        })

        page.getButtonSubmitUpdatePayMent().click();
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
        expect(pageCheckout.getSpanPaymentmethod()).toEqual(resultPaymentAfter[0].paymentMethod);
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image45.png');
        });

    })

    it('Check data valid_Payment method Regist User Info page', async()=>{
        let userId = 'testcsv';
        let password = '123456';
        var sqlDelete2 = "DELETE FROM user WHERE user_id = '" + userId + "'";
        var sqlDelete = "DELETE FROM user_store WHERE user_id = '" + userId + "'";
        mySQLDB.executeSQLSync("DELETE FROM payment_method WHERE user_id = '" + userId + "'");
        mySQLDB.executeSQLSync(sqlDelete);
        mySQLDB.executeSQLSync(sqlDelete2);

        page.navigateTo();
        browser.waitForAngular();
        page.getButtonLogout().click();
        browser.waitForAngular();
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image46.png');
        });
        signUpPage.getSignUpButtonFromHome().click();
        browser.waitForAngular();
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image47.png');
        });
        signUpPage.getUsername().sendKeys(userId);
        browser.waitForAngular();
        signUpPage.getPassword().sendKeys(password);
        browser.waitForAngular();
        signUpPage.getPasswordConfirm().sendKeys(password);
        signUpPage.getButtonSubmit().click();
        browser.waitForAngular();
        browser.waitForAngularEnabled();

        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image48.png');
        });

        pageUserInfoDialog.getLinkRegistryPaymentMethod().click();
        browser.waitForAngular();

        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image49.png');
        });

        page.getButtonSubmitAddPayment().click();
        browser.waitForAngular();
        expect(page.getMessageError()).toEqual('支払方法 を入力してください。');
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image50.png');
        });
        page.getPaymentMethod().sendKeys('あ');
        browser.waitForAngular();
        page.getButtonSubmitAddPayment().click();
        browser.waitForAngular();
        expect(page.getMessageError()).toEqual('ｶｰﾄﾞ番号 を入力してください。');
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image51.png');
        });
        page.getCardNumber().sendKeys('1111-1111-1111-1111');
        browser.waitForAngular();
        page.getButtonSubmitAddPayment().click();
        browser.waitForAngular();
        expect(page.getMessageError()).toEqual('ｶｰﾄﾞ名義人 を入力してください。');
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image52.png');
        });
        page.getOwnerName().sendKeys('テストユーザー');
        browser.waitForAngular();
        page.getCardNumber().clear();
        page.getCardNumber().sendKeys('111111111-111');
        browser.waitForAngular();
        page.getButtonSubmitAddPayment().click();
        browser.waitForAngular();
        expect(page.getMessageError()).toEqual('ｶｰﾄﾞ番号のフォーマットが正しくないです。');
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image53.png');
        });
        var EC = protractor.ExpectedConditions;
        var condition = EC.elementToBeClickable(page.getButtonCancleAddPayment());
        browser.wait(condition,5000);
        page.getButtonCancleAddPayment().click();
        browser.waitForAngular();
    })

    it('Add Payment Method on User Info Dialog', async () => {
        let userId = "testcsv";
        let responsePayment = cmnFuncs.getDataFromRestAPI('paymentmethod/getPaymentMethodInfoByUserID/' + userId);
        let resultPayment: any = await cmnFuncs.getJsonDataFromJsonBodyOfResponsePromise(responsePayment.jsonBody);
        var dataPaymentMethod = {
            user_id: browser.params.userForTest,
            payment_no: 1,
            payment_method: 'JCBカード',
            card_number: '1111-1111-1111-1111',
            card_holder_name: 'テストユーザー',
            month: '04'
        }
        browser.waitForAngular();
        var EC = protractor.ExpectedConditions;
        var condition = EC.elementToBeClickable(pageUserInfoDialog.getLinkRegistryPaymentMethod());
        browser.wait(condition,5000);
        pageUserInfoDialog.getLinkRegistryPaymentMethod().click();
        browser.waitForAngular();
        page.getPaymentMethod().click();
        page.getPaymentMethod().clear();
        cmnFuncs.waitForSendKeysAngular();
        page.getPaymentMethod().sendKeys(dataPaymentMethod.payment_method);
        browser.waitForAngular();
        browser.waitForAngularEnabled();
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image54.png');
        });
        browser.waitForAngular();
        page.getCardNumber().click();
        page.getCardNumber().clear();
        page.getCardNumber().sendKeys(dataPaymentMethod.card_number);
        browser.waitForAngular();
        browser.waitForAngularEnabled();
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image55.png');
        });
        browser.waitForAngular();
        page.getOwnerName().click();
        page.getOwnerName().clear();
        page.getOwnerName().sendKeys(dataPaymentMethod.card_holder_name);
        browser.waitForAngular();
        browser.waitForAngularEnabled();
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image56.png');
        });
        browser.waitForAngular();
        page.getSelectMonthAdd().click()
        browser.waitForAngular();
        browser.waitForAngularEnabled();
        page.getOpionSelect(4).click();
        browser.waitForAngular();
        browser.waitForAngularEnabled();
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image57.png');
        });

        page.getSelectYearAdd().click()
        browser.waitForAngular();
        browser.waitForAngularEnabled();
        page.getOpionSelect(3).click();
        browser.waitForAngular();
        browser.waitForAngularEnabled();
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image58.png');
        });
        let year;
        await page.getYearAdd().then(async (value) => {
            year = value;
        })

        page.getButtonSubmitAddPayment().click();
        browser.waitForAngular();

        let responsePaymentAfter = cmnFuncs.getDataFromRestAPI('paymentmethod/getPaymentMethodInfoByUserID/' + userId);
        let resultPaymentAfter: any = await cmnFuncs.getJsonDataFromJsonBodyOfResponsePromise(responsePaymentAfter.jsonBody);

        expect(resultPayment.length).toBeLessThan(resultPaymentAfter.length);
        expect(resultPaymentAfter[0].primaryKey.userId).toEqual(userId);
        expect(resultPaymentAfter[0].paymentMethod).toEqual(dataPaymentMethod.payment_method);
        expect(resultPaymentAfter[0].cardNumber).toEqual(dataPaymentMethod.card_number);
        expect(resultPaymentAfter[0].cardHolderName).toEqual(dataPaymentMethod.card_holder_name);
        let dateafter = new Date(resultPaymentAfter[0].expirationDate);
        expect(year).toEqual(dateafter.getFullYear() + '');
        expect(dataPaymentMethod.month).toEqual(cmnFuncs.checkSmallerThan10(dateafter.getMonth() + 1) + '');
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image59.png');
        });
    })
})
