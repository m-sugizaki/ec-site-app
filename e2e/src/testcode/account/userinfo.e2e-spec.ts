import { browser, logging } from 'protractor';
import { CommonFuns } from '../../testutils/common.functions';
import { LoginPage } from '../../pageobjects/login.po';
import { UserInfoPage } from '../../pageobjects/userinfo.po';
import { async } from '@angular/core/testing';

describe('ECサイト User Info', () => {
    let page: UserInfoPage;
    let cmnFuncs: CommonFuns;
    let pathOfImage: string;
    let pageLogin: LoginPage;

    beforeAll(() => {
        browser.driver.manage().window().maximize();
        pageLogin = new LoginPage();
        page = new UserInfoPage();
        cmnFuncs = new CommonFuns();

        pathOfImage = cmnFuncs.getRootEvidenceFolderName() + '\\account';
        cmnFuncs.initEvidenceFolder(pathOfImage);

        //データ準備
        cmnFuncs.createUserForTest();
    });

    afterAll(() => {
        pageLogin.navigateTo();
        browser.waitForAngular();
        pageLogin.getButtonLogOut().click();
    });

    it('Check User Info Display', async () => {
        page.navigateTo();
        browser.waitForAngular();
        pageLogin.getButtonOpenLoginDialog().click();
        browser.waitForAngular();
        page.getInputUserId().click();
        page.getInputUserId().clear();
        page.getInputUserId().sendKeys(browser.params.userForTest);
        cmnFuncs.waitForSendKeysAngular();
        browser.waitForAngular();
        page.getInputPassword().click();
        page.getInputPassword().clear();
        page.getInputPassword().sendKeys(browser.params.passwordOfUserForTest);
        cmnFuncs.waitForSendKeysAngular();
        browser.waitForAngular();
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image1.png');
        });
        pageLogin.getSubmitButton().click();
        browser.waitForAngular();

        let value = browser.executeScript("return window.localStorage.getItem('token');");
        let result = await cmnFuncs.getJsonDataFromJsonBodyOfResponsePromise(value);

        let response = cmnFuncs.getDataFromRestAPI('user/' + result);
        let userInfo: any = await cmnFuncs.getJsonDataFromJsonBodyOfResponsePromise(response.jsonBody);

        let responsePayment = cmnFuncs.getDataFromRestAPI('paymentmethod/getPaymentMethodInfoByUserID/' + userInfo.primaryKey.userId);
        let payment: any = await cmnFuncs.getJsonDataFromJsonBodyOfResponsePromise(responsePayment.jsonBody);

        let responseShipping = cmnFuncs.getDataFromRestAPI('shippingaddress/getShippingAddressInfoByUserID/' + userInfo.primaryKey.userId);
        let shipping: any = await cmnFuncs.getJsonDataFromJsonBodyOfResponsePromise(responseShipping.jsonBody);

        page.getButtonInfoMenu().click();

        expect(page.getUserId()).toEqual(userInfo.primaryKey.userId);
        expect(page.getName()).toEqual(userInfo.name);
        expect(page.getNickName()).toEqual(userInfo.nickname);
        expect(page.getPostalCode()).toEqual(userInfo.postalCode);
        expect(page.getAddress1()).toEqual(userInfo.address1);
        expect(page.getAddress2()).toEqual(userInfo.address2);
        expect(page.getPhoneNumber()).toEqual(userInfo.phoneNumber);
        expect(page.getEmail()).toEqual(userInfo.email);
        expect(page.getBirthday()).toEqual(cmnFuncs.formatYYYYMMDD(userInfo.birthday));
        expect(page.getMemberRank()).toEqual(userInfo.memberRank);

        await browser.executeScript('window.scrollTo(0,document.body.scrollHeight);').then(function () {

        })

        await page.getPaymentCountTr().then((value: any) => {
            expect(value.length).toBe(payment.length);
        })
        for (let i = 0; i < payment.length; i++) {
            expect(page.getPaymentTd(i + 1, 1).getText()).toEqual(payment[i].primaryKey.paymentNo + '');
            expect(page.getPaymentTd(i + 1, 2).getText()).toEqual(payment[i].paymentMethod);
            expect(page.getPaymentTd(i + 1, 3).getText()).toEqual(payment[i].cardNumber);
            expect(page.getPaymentTd(i + 1, 4).getText()).toEqual(cmnFuncs.formatMonthYear(payment[i].expirationDate));
            expect(page.getPaymentTd(i + 1, 5).getText()).toEqual(payment[i].cardHolderName);
        }

        await page.getShippingCountTr().then((value: any) => {
            expect(value.length).toBe(shipping.length);
        })
        for (let i = 0; i < shipping.length; i++) {
            expect(page.getShippingTd(i + 1, 1).getText()).toEqual(shipping[i].primaryKey.shippingAddressNo + '');
            expect(page.getShippingTd(i + 1, 2).getText()).toEqual(shipping[i].postalCode);
            expect(page.getShippingTd(i + 1, 3).getText()).toEqual(shipping[i].address1);
            expect(page.getShippingTd(i + 1, 4).getText()).toEqual(shipping[i].address2);
            expect(page.getShippingTd(i + 1, 5).getText()).toEqual(shipping[i].phoneNumber);
            expect(page.getShippingTd(i + 1, 6).getText()).toEqual(shipping[i].shippingAddressName);
        }

        page.getlastTrPayment(payment.length).click();
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image2.png');
        });

        if (payment.length != 0) {
            page.getlastTrPayment(payment.length).click();
            browser.takeScreenshot().then(function (png) {
                cmnFuncs.writeScreenShot(png, pathOfImage + '\\image3.png');
            });
        }

        if (shipping.length != 0) {
            page.getlastTrShiping(shipping.length).click();
            browser.takeScreenshot().then(function (png) {
                cmnFuncs.writeScreenShot(png, pathOfImage + '\\image4.png');
            });
        }

        page.getButtonUpdateUserInfo().click();
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image5.png');
        });
    })
})
