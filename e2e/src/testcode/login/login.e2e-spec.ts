import { browser, logging, protractor } from 'protractor';
import { LoginPage } from '../../pageobjects/login.po';
import { ResponsePromise } from 'protractor-http-client/dist/promisewrappers';
import { CommonFuns } from '../../testutils/common.functions';
import { MySQLDB } from '../../testutils/mysql.db';

describe('Login Dialog', () => {
  let page: LoginPage;
  let commonFunction: CommonFuns;
  let pathOfImage : string;
  let mySQLDB: MySQLDB;

  beforeAll(() => {
    browser.driver.manage().window().maximize();
    page = new LoginPage();
    commonFunction = new CommonFuns();
    mySQLDB = new MySQLDB();

    pathOfImage = commonFunction.getRootEvidenceFolderName() + '\\login';
    commonFunction.initEvidenceFolder(pathOfImage);

    //データ準備
    commonFunction.createUserForTest();
    mySQLDB.executeSQLSync("DELETE FROM user_store WHERE user_id = 'manhkhangabc'");
  });

  afterAll (() => {
    page.navigateTo();
    browser.waitForAngular();
    page.getButtonLogOut().click();
  });

  it('Should show error message when username or password is empty', async () => {
    let EC = protractor.ExpectedConditions;
    let condition = EC.elementToBeClickable(page.getButtonOpenLoginDialog());

    page.navigateTo();
    browser.wait(condition, 5000);

    let condition2 = EC.elementToBeClickable(page.getUsername());
    page.getButtonOpenLoginDialog().click();
    browser.wait(condition2, 5000);

    page.getUsername().clear();
    page.getUsername().click();
    page.getUsername().sendKeys('');
    page.getPassword().clear();
    page.getPassword().click();
    page.getPassword().sendKeys('123456');

    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image1.png');
    });
    browser.waitForAngular();
    page.getSubmitButton().click();
    browser.waitForAngular();
    let result = await commonFunction.getJsonDataFromJsonBodyOfResponsePromise(page.getMessage());
    expect(result).toEqual("ユーザーID の値を入力してください。")
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image2.png');
    });

    page.navigateTo();
    page.getButtonOpenLoginDialog().click();
    page.getUsername().sendKeys('manhkhang');
    page.getPassword().sendKeys('');

    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image3.png');
    });
    page.getSubmitButton().click();
    browser.waitForAngular();
    let result2 = await commonFunction.getJsonDataFromJsonBodyOfResponsePromise(page.getMessage());
    expect(result2).toEqual("パスワード の値を入力してください。")
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image4.png');
    });

    page.navigateTo();
    page.getButtonOpenLoginDialog().click();
    page.getUsername().sendKeys('');
    page.getPassword().sendKeys('');

    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image5.png');
    });
    page.getSubmitButton().click();
    browser.waitForAngular();
    let result3 = await commonFunction.getJsonDataFromJsonBodyOfResponsePromise(page.getMessage());
    expect(result3).toEqual("ユーザーID の値を入力してください。")
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image6.png');
    });
  });

  it('Should show error message when username or password is wrong', async () => {
    pathOfImage = commonFunction.getRootEvidenceFolderName() + '\\login';

    let data = {
      "primaryKey": {"userId" : "manhkhangabc"},
      "password": "123456"
    }

    let response = commonFunction.postDataToRestAPI('user/checkAccount', data);
    let resultCheckAccount: any = await commonFunction.getJsonDataFromJsonBodyOfResponsePromise(response.jsonBody);

    let EC = protractor.ExpectedConditions;
    let condition = EC.elementToBeClickable(page.getButtonOpenLoginDialog());

    page.navigateTo();
    browser.wait(condition, 5000);

    let condition2 = EC.elementToBeClickable(page.getUsername());
    page.getButtonOpenLoginDialog().click();
    browser.wait(condition2, 5000);

    page.getUsername().clear();
    page.getUsername().click();
    page.getUsername().sendKeys('manhkhangabc');
    commonFunction.waitForSendKeysAngular();
    page.getPassword().clear();
    page.getPassword().click();
    page.getPassword().sendKeys('123456');
    commonFunction.waitForSendKeysAngular();

    expect(resultCheckAccount).toBeFalsy();
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image7.png');
    });

    page.getSubmitButton().click();
    browser.waitForAngular();
    let result = await commonFunction.getJsonDataFromJsonBodyOfResponsePromise(page.getMessage());
    expect(result).toEqual("ユーザIDまたはパスワードが間違っています。再入力してください。")
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));

    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image8.png');
    });
  });

  it('Login Successfully', async () => {
    pathOfImage = commonFunction.getRootEvidenceFolderName() + '\\login';
    page.navigateTo();
    let EC = protractor.ExpectedConditions;
    let data = {
      "primaryKey": {"userId" : browser.params.userForTest},
      "password": browser.params.passwordOfUserForTest
    }

    let responseCheckAccount = commonFunction.postDataToRestAPI('user/checkAccount', data);
    let resultCheckAccount: any = await commonFunction.getJsonDataFromJsonBodyOfResponsePromise(responseCheckAccount.jsonBody);

    page.getButtonOpenLoginDialog().click();
    page.getUsername().click();
    page.getUsername().clear();
    page.getUsername().sendKeys(browser.params.userForTest);
    commonFunction.waitForSendKeysAngular();
    browser.waitForAngular();
    page.getUsername().sendKeys(protractor.Key.TAB);
    page.getPassword().click();
    page.getPassword().clear();
    page.getPassword().sendKeys(browser.params.passwordOfUserForTest);
    commonFunction.waitForSendKeysAngular();
    browser.waitForAngular();

    expect(resultCheckAccount).toBeTruthy();
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image9.png');
    });

    page.getSubmitButton().click();
    browser.waitForAngular();

    let response: ResponsePromise = commonFunction.getDataFromRestAPI("/user/getUserInfoByUserIdList/" + browser.params.userForTest)
    let value = browser.executeScript("return window.localStorage.getItem('token');");
    let result = await commonFunction.getJsonDataFromJsonBodyOfResponsePromise(value);
    let responseLastLogin: ResponsePromise = commonFunction.getDataFromRestAPI("/user/getUserLastLoginHistory/" + result)

    expect(response.header("Content-Type")).toEqual("application/json;charset=UTF-8")

    let result2: any = await commonFunction.getJsonDataFromJsonBodyOfResponsePromise(response.jsonBody);
    let resultLastLogin: any = await commonFunction.getJsonDataFromJsonBodyOfResponsePromise(responseLastLogin.jsonBody);
    browser.waitForAngular();

    expect(resultLastLogin.primaryKey.userId).toEqual(browser.params.userForTest)
    let responseHasProduct: ResponsePromise = commonFunction.getDataFromRestAPI(`productcart/getProductCartInfoByUserID/`+ resultLastLogin.primaryKey.userId)
    let resultHasProduct: any = await commonFunction.getJsonDataFromJsonBodyOfResponsePromise(responseHasProduct.jsonBody);
    await browser.wait( EC.presenceOf(page.getTagHasProductCart()), 5000 );
    if (resultHasProduct.length !== 0) {
      expect(page.getTagHasProductCart().getText()).toEqual('商品カート有無: 有')
    }else {
      expect(page.getTagHasProductCart().getText()).toEqual('商品カート有無: 無')
    }
    expect(page.getNickname()).toEqual(`ようこそ${result2[0].name}さま`)
    expect(page.getLoginDt()).toEqual(`最終ログイン日時: `+ commonFunction.formatDatetime(resultLastLogin.primaryKey.loginDt))
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image10.png');
    });
  });
});
