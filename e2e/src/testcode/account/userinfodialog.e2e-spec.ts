import { browser, logging, protractor } from 'protractor';
import { ResponsePromise } from 'protractor-http-client/dist/promisewrappers';
import { CommonFuns } from '../../testutils/common.functions';
import { SignUpPage } from '../../pageobjects/signup.po';
import { UserInfoDialogPage } from '../../pageobjects/userinfodialog.po';
import { LoginPage } from '../../pageobjects/login.po';
import { MySQLDB } from '../../testutils/mysql.db';
import { ShippingAddressDialogPage } from '../../pageobjects/shippingaddress';
import { PaymentMethodPage } from '../../pageobjects/paymentmethod.po';

describe('User Info Dialog Page', () => {
  let page: UserInfoDialogPage;
  let signUpPage: SignUpPage;
  let loginPage: LoginPage;
  let shippingAddressPage: ShippingAddressDialogPage;
  let paymentMethodPage: PaymentMethodPage;
  let commonFunction: CommonFuns;
  let pathOfImage: string;
  let mySQLDB: MySQLDB;

  beforeAll(() => {
    browser.driver.manage().window().maximize();
    page = new UserInfoDialogPage();
    signUpPage = new SignUpPage();
    loginPage = new LoginPage();
    shippingAddressPage = new ShippingAddressDialogPage();
    paymentMethodPage = new PaymentMethodPage();
    commonFunction = new CommonFuns();
    mySQLDB = new MySQLDB();

    pathOfImage = commonFunction.getRootEvidenceFolderName() + '\\userinfodialog';
    commonFunction.initEvidenceFolder(pathOfImage);
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;

    //データ準備
    commonFunction.createUserForTest();
    mySQLDB.executeSQLSync("DELETE FROM user_store WHERE user_id = 'csvtest4' ");
    mySQLDB.executeSQLSync("DELETE FROM user WHERE user_id = 'csvtest4' ");
    mySQLDB.executeSQLSync("DELETE FROM user_store WHERE user_id = 'csvtest5' ");
    mySQLDB.executeSQLSync("DELETE FROM user WHERE user_id = 'csvtest5' ");
  });

  afterAll(() => {
    browser.waitForAngular();
    loginPage.navigateTo();
    browser.waitForAngular();
    loginPage.getButtonLogOut().click();
  });

  it('Should show message error when an input is empty or format is wrong ', async () => {
    let userId = 'csvtest4'
    let password = '123456'
    var EC = protractor.ExpectedConditions;
    var condition = EC.elementToBeClickable(signUpPage.getSignUpButtonFromHome());

    loginPage.navigateTo();
    browser.wait(condition, 5000);
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image1.png');
    });

    var condition = EC.elementToBeClickable(signUpPage.getUsername());
    signUpPage.getSignUpButtonFromHome().click();
    browser.wait(condition, 5000);
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image2.png');
    });

    signUpPage.getUsername().clear();
    signUpPage.getUsername().click();
    signUpPage.getUsername().sendKeys(userId);
    browser.waitForAngular();
    signUpPage.getPassword().clear();
    signUpPage.getPassword().click();
    signUpPage.getPassword().sendKeys(password);
    browser.waitForAngular();
    signUpPage.getPasswordConfirm().clear();
    signUpPage.getPasswordConfirm().click();
    signUpPage.getPasswordConfirm().sendKeys(password);
    browser.waitForAngular();
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image3.png');
    });

    signUpPage.getButtonSubmit().click();
    browser.waitForAngular();

    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image4.png');
    });
    page.getButtonSubmit().click();
    browser.waitForAngular();
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image5.png');
    });
    let resultMessage1: any = await commonFunction.getJsonDataFromJsonBodyOfResponsePromise(page.getMessage());
    expect(resultMessage1).toEqual('氏名 を入力してください。')
    browser.waitForAngular();
    //==================================================================================================================
    page.getName().sendKeys('CSV TEST 4');
    browser.waitForAngular();
    page.getButtonSubmit().click();
    browser.waitForAngular();
    let resultMessage2: any = await commonFunction.getJsonDataFromJsonBodyOfResponsePromise(page.getMessage());
    expect(resultMessage2).toEqual('ﾆｯｸﾈｰﾑ を入力してください。')
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image6.png');
    });
    //==================================================================================================================
    page.getNickname().sendKeys('CSV TEST 4');
    browser.waitForAngular();
    page.getButtonSubmit().click();
    browser.waitForAngular();
    let resultMessage3: any = await commonFunction.getJsonDataFromJsonBodyOfResponsePromise(page.getMessage());
    expect(resultMessage3).toEqual('郵便番号 を入力してください。')
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image7.png');
    });
    //==================================================================================================================
    page.getPostalCode().sendKeys('12324564');
    browser.waitForAngular();
    page.getButtonSubmit().click();
    browser.waitForAngular();
    let resultMessage4: any = await commonFunction.getJsonDataFromJsonBodyOfResponsePromise(page.getMessage());
    expect(resultMessage4).toEqual('住所1 を入力してください。')
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image8.png');
    });
    //==================================================================================================================
    page.getAddress1().sendKeys('都道府県、市町村、丁目番地');
    browser.waitForAngular();
    page.getButtonSubmit().click();
    browser.waitForAngular();
    let resultMessage5: any = await commonFunction.getJsonDataFromJsonBodyOfResponsePromise(page.getMessage());
    expect(resultMessage5).toEqual('電話番号 を入力してください。')
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image9.png');
    });
    //==================================================================================================================
    page.getPhoneNumber().sendKeys('111112111121111');
    browser.waitForAngular();
    page.getButtonSubmit().click();
    browser.waitForAngular();
    let resultMessage6: any = await commonFunction.getJsonDataFromJsonBodyOfResponsePromise(page.getMessage());
    expect(resultMessage6).toEqual('E-mail を入力してください。')
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image10.png');
    });
    //==================================================================================================================
    page.getEmail().sendKeys('testgmail.com');
    browser.waitForAngular();
    page.getButtonSubmit().click();
    browser.waitForAngular();
    let resultMessage7: any = await commonFunction.getJsonDataFromJsonBodyOfResponsePromise(page.getMessage());
    expect(resultMessage7).toEqual('生年月日 を入力してください。')
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image11.png');
    });
    //==================================================================================================================
    page.getBirthday().sendKeys('1996-03-09');
    browser.waitForAngular();
    page.getButtonSubmit().click();
    browser.waitForAngular();
    let resultMessage8: any = await commonFunction.getJsonDataFromJsonBodyOfResponsePromise(page.getMessage());
    expect(resultMessage8).toEqual('郵便番号のフォーマットが正しくないです。')
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image12.png');
    });
    //==================================================================================================================
    page.getPostalCode().clear();
    page.getPostalCode().sendKeys('123-4564');
    browser.waitForAngular();
    page.getButtonSubmit().click();
    browser.waitForAngular();
    let resultMessage9: any = await commonFunction.getJsonDataFromJsonBodyOfResponsePromise(page.getMessage());
    expect(resultMessage9).toEqual('電話番号のフォーマットが正しくないです。')
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image13.png');
    });
    //==================================================================================================================
    page.getPhoneNumber().clear();
    page.getPhoneNumber().sendKeys('11111-1111-1111')
    browser.waitForAngular();
    page.getButtonSubmit().click();
    browser.waitForAngular();
    let resultMessage10: any = await commonFunction.getJsonDataFromJsonBodyOfResponsePromise(page.getMessage());
    expect(resultMessage10).toEqual('Emailのフォーマットが正しくないです。')
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image14.png');
    });
    //==================================================================================================================
    page.getEmail().clear();
    page.getEmail().sendKeys('test@gmail.com');
    browser.waitForAngular();
    page.getButtonSubmit().click();
    browser.waitForAngular();
    let resultMessage11: any = await commonFunction.getJsonDataFromJsonBodyOfResponsePromise(page.getMessage());
    expect(resultMessage11).toEqual('日付のフォーマットが正しくないです。')
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image15.png');
    });
  });

  it('Should open Payment Method Dialog', async () => {
    let EC = protractor.ExpectedConditions;
    let condition = EC.elementToBeClickable(page.getLinkRegistryPaymentMethod());
    browser.waitForAngular();
    browser.wait(condition, 5000);
    page.getLinkRegistryPaymentMethod().click();
    browser.waitForAngular();
    let newDialog: any = await commonFunction.getJsonDataFromJsonBodyOfResponsePromise(browser.getWindowHandle());
    browser.switchTo().window(newDialog)
    let allDialog: any = await commonFunction.getJsonDataFromJsonBodyOfResponsePromise(browser.getAllWindowHandles());

    expect(allDialog[0]).toEqual(newDialog);
    expect(paymentMethodPage.getTitle()).toEqual('支払い方法情報登録');
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image16.png');
    });
    paymentMethodPage.getButtonCancel().click();
    browser.waitForAngular();
    browser.waitForAngularEnabled();
  });

  it('Should open Shipping Address Dialog', async () => {
    let EC = protractor.ExpectedConditions;
    let condition = EC.elementToBeClickable(page.getLinkRegistryShippingAddress());

    browser.waitForAngular();
    browser.wait(condition, 5000);
    page.getLinkRegistryShippingAddress().click();
    browser.waitForAngular();
    let newDialog: any = await commonFunction.getJsonDataFromJsonBodyOfResponsePromise(browser.getWindowHandle());
    browser.switchTo().window(newDialog)
    let allDialog: any = await commonFunction.getJsonDataFromJsonBodyOfResponsePromise(browser.getAllWindowHandles());
    expect(shippingAddressPage.getTitleFromDialogRegister()).toEqual('お届け先情報登録');
    expect(allDialog[0]).toEqual(newDialog);
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image17.png');
    });
    shippingAddressPage.getButtonCancel().click();
  });

  it('Register User Info Successfully from Home Page', async () => {
    let userId = 'csvtest4'
    let password = '123456'
    let name = 'CSV TEST 4'
    let nickname = 'CSV TEST 4'
    let address1 = '都道府県、市町村、丁目番地'
    let address2 = ''
    let email = 'test@gmail.com'
    let phoneNumber = '11111-1111-1111'
    let postalCode = '123-4564'
    let birthday = '1996/03/09'
    let inputData = {
      "primaryKey": { "userId": userId },
      "password": password
    }
    let EC = protractor.ExpectedConditions;
    expect(page.getUserId()).toEqual(userId);

    browser.waitForAngular();
    page.getName().clear();
    page.getName().click();
    page.getName().sendKeys(name);
    page.getNickname().clear();
    page.getNickname().click();
    page.getNickname().sendKeys(nickname);
    page.getPostalCode().clear();
    page.getPostalCode().click();
    page.getPostalCode().sendKeys(postalCode);
    page.getAddress1().clear();
    page.getAddress1().click();
    page.getAddress1().sendKeys(address1);
    page.getAddress2().clear();
    page.getAddress2().click();
    page.getAddress2().sendKeys(address2);
    page.getPhoneNumber().clear();
    page.getPhoneNumber().click();
    page.getPhoneNumber().sendKeys(phoneNumber);
    page.getEmail().clear();
    page.getEmail().click();
    page.getEmail().sendKeys(email);
    page.getBirthday().clear();
    page.getBirthday().click();
    page.getBirthday().sendKeys(birthday);
    browser.waitForAngular();
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image18.png');
    });
    page.getButtonSubmit().click();
    browser.waitForAngular();

    let responseCheckUser: ResponsePromise = commonFunction.postDataToRestAPI("/user/checkAccount/", inputData);
    let resultCheckUser: any = await commonFunction.getJsonDataFromJsonBodyOfResponsePromise(responseCheckUser.jsonBody);
    let responseGetUserInfo: ResponsePromise = commonFunction.getDataFromRestAPI("/user/getUserInfoByUserIdList/" + userId);
    let resultGetUserInfo: any = await commonFunction.getJsonDataFromJsonBodyOfResponsePromise(responseGetUserInfo.jsonBody);

    expect(resultCheckUser).toBeTruthy();
    expect(resultGetUserInfo[0].name).toEqual(name);
    expect(resultGetUserInfo[0].nickname).toEqual(nickname);
    expect(resultGetUserInfo[0].postalCode).toEqual(postalCode);
    expect(resultGetUserInfo[0].address1).toEqual(address1);
    expect(resultGetUserInfo[0].address2).toEqual(address2);
    expect(resultGetUserInfo[0].phoneNumber).toEqual(phoneNumber);
    expect(resultGetUserInfo[0].email).toEqual(email);
    expect(commonFunction.formatDate(resultGetUserInfo[0].birthday)).toEqual(birthday);

    let value = browser.executeScript("return window.localStorage.getItem('token');");
    let result = await commonFunction.getJsonDataFromJsonBodyOfResponsePromise(value);
    let responseLastLogin: ResponsePromise = commonFunction.getDataFromRestAPI("/user/getUserLastLoginHistory/" + result)
    let resultLastLogin: any = await commonFunction.getJsonDataFromJsonBodyOfResponsePromise(responseLastLogin.jsonBody);
    let responseHasProduct: ResponsePromise = commonFunction.getDataFromRestAPI(`productcart/getProductCartInfoByUserID/` + resultLastLogin.primaryKey.userId)
    let resultHasProduct: any = await commonFunction.getJsonDataFromJsonBodyOfResponsePromise(responseHasProduct.jsonBody);
    await browser.wait(EC.presenceOf(loginPage.getTagHasProductCart()), 5000);
    if (resultHasProduct.length !== 0) {
      expect(loginPage.getTagHasProductCart().getText()).toEqual('商品カート有無: 有')
    } else {
      expect(loginPage.getTagHasProductCart().getText()).toEqual('商品カート有無: 無')
    }
    expect(loginPage.getNickname()).toEqual(`ようこそ${resultGetUserInfo[0].name}さま`)
    expect(loginPage.getLoginDt()).toEqual(`最終ログイン日時: ` + commonFunction.formatDatetime(resultLastLogin.primaryKey.loginDt))

    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image19.png');
    });
    loginPage.getButtonLogOut().click();
  });

  it('Register User Info Successfully from Login Dialog', async () => {
    let userId = 'csvtest5'
    let password = '123456'
    let name = 'CSV TEST 5'
    let nickname = 'CSV TEST 5'
    let address1 = '都道府県、市町村、丁目番地'
    let address2 = ''
    let email = 'test5@gmail.com'
    let phoneNumber = '11111-2345-1111'
    let postalCode = '123-4564'
    let birthday = '1996/03/09'
    let inputData = {
      "primaryKey": { "userId": userId },
      "password": password
    }
    let EC = protractor.ExpectedConditions;
    let condition = EC.elementToBeClickable(loginPage.getButtonOpenLoginDialog());

    loginPage.navigateTo();
    browser.wait(condition, 1000);
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image20.png');
    });
    let condition2 = EC.elementToBeClickable(signUpPage.getSignUpBUttonFromLogin());
    loginPage.getButtonOpenLoginDialog().click();
    browser.wait(condition2, 1000);
    browser.waitForAngular();
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image21.png');
    });
    signUpPage.getSignUpBUttonFromLogin().click();
    browser.waitForAngular();
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image22.png');
    });
    signUpPage.getUsername().clear();
    signUpPage.getUsername().click();
    signUpPage.getUsername().sendKeys(userId);
    browser.waitForAngular();
    signUpPage.getPassword().clear();
    signUpPage.getPassword().click();
    signUpPage.getPassword().sendKeys(password);
    browser.waitForAngular();
    signUpPage.getPasswordConfirm().clear();
    signUpPage.getPasswordConfirm().click();
    signUpPage.getPasswordConfirm().sendKeys(password);
    browser.waitForAngular();
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image23.png');
    });

    signUpPage.getButtonSubmit().click();
    browser.waitForAngular();

    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image24.png');
    });
    expect(page.getUserId()).toEqual(userId);
    page.getName().clear();
    page.getName().click();
    page.getName().sendKeys(name);
    page.getNickname().clear();
    page.getNickname().click();
    page.getNickname().sendKeys(nickname);
    page.getPostalCode().clear();
    page.getPostalCode().click();
    page.getPostalCode().sendKeys(postalCode);
    page.getAddress1().clear();
    page.getAddress1().click();
    page.getAddress1().sendKeys(address1);
    page.getAddress2().clear();
    page.getAddress2().click();
    page.getAddress2().sendKeys(address2);
    page.getPhoneNumber().clear();
    page.getPhoneNumber().click();
    page.getPhoneNumber().sendKeys(phoneNumber);
    page.getEmail().clear();
    page.getEmail().click();
    page.getEmail().sendKeys(email);
    page.getBirthday().clear();
    page.getBirthday().click();
    page.getBirthday().sendKeys(birthday);
    browser.waitForAngular();
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image25.png');
    });
    page.getButtonSubmit().click();
    commonFunction.waitForLoadPage();

    let responseCheckUser: ResponsePromise = commonFunction.postDataToRestAPI("/user/checkAccount/", inputData);
    let resultCheckUser: any = await commonFunction.getJsonDataFromJsonBodyOfResponsePromise(responseCheckUser.jsonBody);
    let responseGetUserInfo: ResponsePromise = commonFunction.getDataFromRestAPI("/user/getUserInfoByUserIdList/" + userId);
    let resultGetUserInfo: any = await commonFunction.getJsonDataFromJsonBodyOfResponsePromise(responseGetUserInfo.jsonBody);

    expect(resultCheckUser).toBeTruthy();
    expect(resultGetUserInfo[0].name).toEqual(name);
    expect(resultGetUserInfo[0].nickname).toEqual(nickname);
    expect(resultGetUserInfo[0].postalCode).toEqual(postalCode);
    expect(resultGetUserInfo[0].address1).toEqual(address1);
    expect(resultGetUserInfo[0].address2).toEqual(address2);
    expect(resultGetUserInfo[0].phoneNumber).toEqual(phoneNumber);
    expect(resultGetUserInfo[0].email).toEqual(email);
    expect(commonFunction.formatDate(resultGetUserInfo[0].birthday)).toEqual(birthday);

    let value = browser.executeScript("return window.localStorage.getItem('token');");
    let result = await commonFunction.getJsonDataFromJsonBodyOfResponsePromise(value);
    let responseLastLogin: ResponsePromise = commonFunction.getDataFromRestAPI("/user/getUserLastLoginHistory/" + result)
    let resultLastLogin: any = await commonFunction.getJsonDataFromJsonBodyOfResponsePromise(responseLastLogin.jsonBody);
    let responseHasProduct: ResponsePromise = commonFunction.getDataFromRestAPI(`productcart/getProductCartInfoByUserID/` + resultLastLogin.primaryKey.userId)
    let resultHasProduct: any = await commonFunction.getJsonDataFromJsonBodyOfResponsePromise(responseHasProduct.jsonBody);
    await browser.wait(EC.presenceOf(loginPage.getTagHasProductCart()), 5000);
    if (resultHasProduct.length !== 0) {
      expect(loginPage.getTagHasProductCart().getText()).toEqual('商品カート有無: 有')
    } else {
      expect(loginPage.getTagHasProductCart().getText()).toEqual('商品カート有無: 無')
    }
    expect(loginPage.getNickname()).toEqual(`ようこそ${resultGetUserInfo[0].name}さま`)
    expect(loginPage.getLoginDt()).toEqual(`最終ログイン日時: ` + commonFunction.formatDatetime(resultLastLogin.primaryKey.loginDt))

    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image26.png');
    });
  });
});
