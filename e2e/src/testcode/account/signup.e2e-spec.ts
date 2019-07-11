import { browser, logging, protractor } from 'protractor';
import { ResponsePromise } from 'protractor-http-client/dist/promisewrappers';
import { CommonFuns } from '../../testutils/common.functions';
import { SignUpPage } from '../../pageobjects/signup.po';
import { UserInfoDialogPage } from '../../pageobjects/userinfodialog.po';
import { MySQLDB } from '../../testutils/mysql.db';

describe('Sign Up Page', () => {
  let page: SignUpPage;
  let userInfoDialogPage: UserInfoDialogPage;
  let commonFunction: CommonFuns;
  let pathOfImage: string;
  let mySQLDB: MySQLDB;
  beforeAll(() => {
    browser.driver.manage().window().maximize();

    page = new SignUpPage();
    userInfoDialogPage = new UserInfoDialogPage();
    commonFunction = new CommonFuns();
    mySQLDB = new MySQLDB();
    pathOfImage = commonFunction.getRootEvidenceFolderName() + '\\signup';
    commonFunction.initEvidenceFolder(pathOfImage);

    //データ準備
    commonFunction.createUserForTest();
    mySQLDB.executeSQLSync("DELETE FROM user_store WHERE user_id = 'usertest'");
    mySQLDB.executeSQLSync("DELETE FROM user_store WHERE user_id = 'usertest2'");
    mySQLDB.executeSQLSync("DELETE FROM user_store WHERE user_id = 'usertest3'");
  });

  it('Should show message Error when inputs are empty', async () => {
    page.navigateTo();
    browser.waitForAngular();
    browser.waitForAngularEnabled();
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image1.png');
    });
    page.getSignUpButtonFromHome().click();
    browser.waitForAngular();
    browser.waitForAngularEnabled();

    page.getButtonSubmit().click();
    browser.waitForAngular();
    let resultMessageError: any = await commonFunction.getJsonDataFromJsonBodyOfResponsePromise(page.getMessageError());
    expect(resultMessageError).toEqual('ユーザーIDの値を入力してください。');

    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image2.png');
    });
  });

  it('Should show message Error when password is empty', async () => {
    page.getUsername().click();
    page.getUsername().sendKeys('test1');
    browser.waitForAngular();
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image3.png');
    });
    page.getButtonSubmit().click();
    browser.waitForAngular();
    let resultMessageError: any = await commonFunction.getJsonDataFromJsonBodyOfResponsePromise(page.getMessageError());
    expect(resultMessageError).toEqual('パスワード の値を入力してください。')
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image4.png');
    });
  });

  it('Should show message Error when confirm password is different from password', async () => {
    let userId = 'test1'
    let password = '123456'
    let confirmPassword = '123456789'
    page.getUsername().clear();
    browser.waitForAngular();
    page.getUsername().sendKeys(userId);
    browser.waitForAngular();
    page.getUsername().sendKeys(protractor.Key.TAB);
    page.getPassword().sendKeys(password);
    browser.waitForAngular();
    page.getPassword().sendKeys(protractor.Key.TAB);
    page.getPasswordConfirm().sendKeys(confirmPassword);
    browser.waitForAngular();
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image5.png');
    });
    page.getButtonSubmit().click();
    browser.waitForAngular();
    let resultMessageError: any = await commonFunction.getJsonDataFromJsonBodyOfResponsePromise(page.getMessageError());

    expect(resultMessageError).toEqual('パスワード (確認) の値を入力してください。')
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image6.png');
    });
  });

  it('Sign Up from Home with existed user', async () => {
    let userId = browser.params.userForTest;
    let password = browser.params.passwordOfUserForTest;
    let inputData = {
      "primaryKey": { "userId": userId },
      "password": password
    }
    let responseCheckUser: ResponsePromise = commonFunction.postDataToRestAPI("/user/checkAccount/", inputData);
    let resultCheckUser: any = await commonFunction.getJsonDataFromJsonBodyOfResponsePromise(responseCheckUser.jsonBody);

    page.navigateTo();
    page.getSignUpButtonFromHome().click();
    browser.waitForAngular();
    page.getUsername().sendKeys(userId);
    commonFunction.waitForSendKeysAngular();
    browser.waitForAngular();
    page.getPassword().sendKeys(password);
    commonFunction.waitForSendKeysAngular();
    browser.waitForAngular();
    page.getPasswordConfirm().sendKeys(password);
    commonFunction.waitForSendKeysAngular();
    browser.waitForAngular();
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image7.png');
    });
    page.getButtonSubmit().click();
    browser.waitForAngular();

    expect(resultCheckUser).toBeTruthy();
    let resultMessageError: any = await commonFunction.getJsonDataFromJsonBodyOfResponsePromise(page.getMessageError());
    expect(resultMessageError).toEqual('ユーザIDが存在しています。再入力してください。')
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image8.png');
    });
  });

  it('Should Successfully Register User from Home', async () => {
    let userId = 'usertest2'
    let password = '123456'
    let inputData = {
      "primaryKey": { "userId": userId },
      "password": password
    }
    browser.waitForAngular();
    page.getUsername().clear();
    page.getUsername().click();
    page.getUsername().sendKeys(userId);
    browser.waitForAngular();
    page.getPassword().clear();
    page.getPassword().click();
    page.getPassword().sendKeys(password);
    browser.waitForAngular();
    page.getPasswordConfirm().clear();
    page.getPasswordConfirm().click();
    page.getPasswordConfirm().sendKeys(password);
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image9.png');
    });
    browser.waitForAngular();
    page.getButtonSubmit().click();
    browser.waitForAngular();
    let response = commonFunction.postDataToRestAPI('user/checkAccount/', inputData);
    let result: any = await commonFunction.getJsonDataFromJsonBodyOfResponsePromise(response.jsonBody);
    expect(result).toBeTruthy();
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image10.png');
    });
  });

  it('Sign Up from Login with existed user', async () => {
    let userId = browser.params.userForTest;
    let password = browser.params.passwordOfUserForTest;
    let inputData = {
      "primaryKey": { "userId": userId },
      "password": password
    }
    let responseCheckUser: ResponsePromise = commonFunction.postDataToRestAPI("/user/checkAccount/", inputData);
    let resultCheckUser: any = await commonFunction.getJsonDataFromJsonBodyOfResponsePromise(responseCheckUser.jsonBody);

    page.navigateTo();
    browser.waitForAngular();
    page.getButtonOpenDialogLogin().click();
    browser.waitForAngular();
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image11.png');
    });
    page.getSignUpBUttonFromLogin().click();
    browser.waitForAngular();
    browser.waitForAngularEnabled();
    page.getUsername().click();
    page.getUsername().sendKeys(userId);
    commonFunction.waitForSendKeysAngular();
    browser.waitForAngular();
    page.getPassword().sendKeys(password);
    commonFunction.waitForSendKeysAngular();
    browser.waitForAngular();
    page.getPasswordConfirm().sendKeys(password);
    commonFunction.waitForSendKeysAngular();
    browser.waitForAngular();
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image12.png');
    });
    page.getButtonSubmit().click();
    browser.waitForAngular();

    expect(resultCheckUser).toBeTruthy();
    let resultMessageError: any = await commonFunction.getJsonDataFromJsonBodyOfResponsePromise(page.getMessageError());
    expect(resultMessageError).toEqual('ユーザIDが存在しています。再入力してください。')
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image13.png');
    });
  });

  it('Should Successfully Register User from Login Dialog', async () => {
    let userId = 'usertest3'
    let password = '123456'
    let inputData = {
      "primaryKey": { "userId": userId },
      "password": password
    }
    browser.waitForAngular();
    page.getUsername().clear();
    page.getUsername().click();
    page.getUsername().sendKeys(userId);
    browser.waitForAngular();
    page.getPassword().clear();
    page.getPassword().click();
    page.getPassword().sendKeys(password);
    browser.waitForAngular();
    page.getPasswordConfirm().clear();
    page.getPasswordConfirm().click();
    page.getPasswordConfirm().sendKeys(password);
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image14.png');
    });
    browser.waitForAngular();
    page.getButtonSubmit().click();
    browser.waitForAngular();
    let response = commonFunction.postDataToRestAPI('user/checkAccount/', inputData);
    let result: any = await commonFunction.getJsonDataFromJsonBodyOfResponsePromise(response.jsonBody);
    expect(result).toBeTruthy();
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image15.png');
    });
  });
});
