import { browser, logging, protractor } from 'protractor';
import { LoginPage } from '../../pageobjects/login.po';
import { CommonFuns } from '../../testutils/common.functions';
import { MySQLDB } from '../../testutils/mysql.db';
import { ChangePassWordPage } from '../../pageobjects/changepassword.po';
import { ResponsePromise } from 'protractor-http-client/dist/promisewrappers';

describe('ECサイト Change Password Dialog', () => {
  let page: ChangePassWordPage;
  let pageLogin: LoginPage
  let cmnFuncs: CommonFuns;
  let pathOfImage: string;
  let mySQLDB: MySQLDB;

  beforeAll(() => {
    browser.driver.manage().window().maximize();
    page = new ChangePassWordPage();
    pageLogin = new LoginPage();
    cmnFuncs = new CommonFuns();
    mySQLDB = new MySQLDB();

    pathOfImage = cmnFuncs.getRootEvidenceFolderName() + '\\changepassword';
    cmnFuncs.initEvidenceFolder(pathOfImage);

    //データ準備
    cmnFuncs.createUserForTest();
  });

  it('Check Input Data Valid', async () => {
    let userIdErr = 'testcsv22';
    let passWordNew = '1234567';
    var sqlDelete2 = "DELETE FROM user WHERE user_id = '" + userIdErr + "'";
    var sqlDelete = "DELETE FROM user_store WHERE user_id = '" + userIdErr + "'";
    let EC = protractor.ExpectedConditions;
    mySQLDB.executeSQLSync(sqlDelete);
    mySQLDB.executeSQLSync(sqlDelete2);

    page.navigateTo();
    browser.waitForAngular();
    pageLogin.getButtonOpenLoginDialog().click();
    browser.waitForAngular();
    page.getButtonChangePassWord().click();
    browser.waitForAngular();
    browser.waitForAngularEnabled();
    browser.wait( EC.presenceOf(page.getTitle()), 5000 );
    expect(page.getTitle().getText()).toEqual('ログイン');
    browser.takeScreenshot().then(function (png) {
      cmnFuncs.writeScreenShot(png, pathOfImage + '\\image1.png');
    });
    page.getButtonSubmit().click();
    browser.waitForAngular();
    expect(page.getMessageError()).toEqual('ユーザID の値を入力してください。');
    browser.takeScreenshot().then(function (png) {
      cmnFuncs.writeScreenShot(png, pathOfImage + '\\image2.png');
    });

    page.getUserId().sendKeys(browser.params.userForTest);
    browser.waitForAngular();
    page.getButtonSubmit().click();
    browser.waitForAngular();
    expect(page.getMessageError()).toEqual('現在のパスワード の値を入力してください。');
    browser.takeScreenshot().then(function (png) {
      cmnFuncs.writeScreenShot(png, pathOfImage + '\\image3.png');
    });

    page.getPassWord().sendKeys(browser.params.passwordOfUserForTest);
    browser.waitForAngular();
    page.getButtonSubmit().click();
    browser.waitForAngular();
    expect(page.getMessageError()).toEqual('新しいパスワードの値を入力してください。');
    browser.takeScreenshot().then(function (png) {
      cmnFuncs.writeScreenShot(png, pathOfImage + '\\image4.png');
    });

    page.getPasswordNew().sendKeys(passWordNew);
    browser.waitForAngular();
    page.getButtonSubmit().click();
    browser.waitForAngular();
    expect(page.getMessageError()).toEqual('新しいパスワード (確認) の値を入力してください。');
    browser.takeScreenshot().then(function (png) {
      cmnFuncs.writeScreenShot(png, pathOfImage + '\\image5.png');
    });
    page.getPasswordConfirm().sendKeys(passWordNew);
    browser.waitForAngular();

    page.getUserId().clear();
    browser.waitForAngular();
    page.getUserId().sendKeys(userIdErr);
    browser.waitForAngular();
    page.getButtonSubmit().click();
    browser.waitForAngular();
    expect(page.getMessageError()).toEqual('ユーザIDが存在していません。');
    browser.takeScreenshot().then(function (png) {
      cmnFuncs.writeScreenShot(png, pathOfImage + '\\image6.png');
    });
    page.getUserId().clear();
    browser.waitForAngular();
    page.getUserId().sendKeys(browser.params.userForTest);
    browser.waitForAngular();

    page.getPassWord().clear();
    browser.waitForAngular();
    page.getPassWord().sendKeys(passWordNew);
    browser.waitForAngular();
    page.getButtonSubmit().click();
    browser.waitForAngular();
    expect(page.getMessageError()).toEqual('ユーザIDが存在していません。');
    browser.takeScreenshot().then(function (png) {
      cmnFuncs.writeScreenShot(png, pathOfImage + '\\image7.png');
    });
    page.getPassWord().clear();
    browser.waitForAngular();
    page.getPassWord().sendKeys(browser.params.passwordOfUserForTest);
    browser.waitForAngular();

    page.getPasswordNew().clear();
    browser.waitForAngular();
    page.getPasswordNew().sendKeys(browser.params.passwordOfUserForTest);
    browser.waitForAngular();
    page.getButtonSubmit().click();
    browser.waitForAngular();
    expect(page.getMessageError()).toEqual('新しいパスワードと新しいパスワード(確認)の値が不一致です。再入力してください。');
    browser.takeScreenshot().then(function (png) {
      cmnFuncs.writeScreenShot(png, pathOfImage + '\\image8.png');
    });
  })

  it('Change Password Success', async () => {
    let passWordNew = '1234567';
    page.getUserId().clear();
    browser.waitForAngular();
    page.getUserId().sendKeys(browser.params.userForTest);
    browser.waitForAngular();
    page.getPasswordNew().clear();
    browser.waitForAngular();
    page.getPasswordNew().sendKeys(passWordNew);
    browser.waitForAngular();
    page.getButtonSubmit().click();
    browser.waitForAngular();
    browser.waitForAngularEnabled();
    let EC = protractor.ExpectedConditions;
    let data = {
      primaryKey: { userId: browser.params.userForTest },
      password: passWordNew
    }
    let responseCheckAccount = cmnFuncs.postDataToRestAPI('user/checkAccount/', data);
    let resultCheckAccount : any = await cmnFuncs.getJsonDataFromJsonBodyOfResponsePromise(responseCheckAccount.jsonBody);
    expect(resultCheckAccount).toBe(true);

    var sqlSelect = "SELECT * FROM user_store WHERE user_id = '" + browser.params.userForTest + "'";
    let findUser : any = await JSON.parse(mySQLDB.executeSQLSync(sqlSelect));
    expect(findUser[0].password).toEqual(cmnFuncs.getMd5Encode(passWordNew));

    let response: ResponsePromise = cmnFuncs.getDataFromRestAPI("/user/getUserInfoByUserIdList/" + browser.params.userForTest)
    let value = browser.executeScript("return window.localStorage.getItem('token');");
    let result = await cmnFuncs.getJsonDataFromJsonBodyOfResponsePromise(value);
    let responseLastLogin: ResponsePromise = cmnFuncs.getDataFromRestAPI("/user/getUserLastLoginHistory/" + result)

    expect(response.header("Content-Type")).toEqual("application/json;charset=UTF-8")

    let result2: any = await cmnFuncs.getJsonDataFromJsonBodyOfResponsePromise(response.jsonBody);
    let resultLastLogin: any = await cmnFuncs.getJsonDataFromJsonBodyOfResponsePromise(responseLastLogin.jsonBody);
    browser.waitForAngular();

    expect(resultLastLogin.primaryKey.userId).toEqual(browser.params.userForTest)
    let responseHasProduct: ResponsePromise = cmnFuncs.getDataFromRestAPI(`productcart/getProductCartInfoByUserID/`+ resultLastLogin.primaryKey.userId)
    let resultHasProduct: any = await cmnFuncs.getJsonDataFromJsonBodyOfResponsePromise(responseHasProduct.jsonBody);
    await browser.wait( EC.presenceOf(pageLogin.getTagHasProductCart()), 5000 );
    if (resultHasProduct.length !== 0) {
      expect(pageLogin.getTagHasProductCart().getText()).toEqual('商品カート有無: 有')
    }else {
      expect(pageLogin.getTagHasProductCart().getText()).toEqual('商品カート有無: 無')
    }
    expect(pageLogin.getNickname()).toEqual(`ようこそ${result2[0].name}さま`)
    expect(pageLogin.getLoginDt()).toEqual(`最終ログイン日時: `+ cmnFuncs.formatDatetime(resultLastLogin.primaryKey.loginDt))

    browser.takeScreenshot().then(function (png) {
      cmnFuncs.writeScreenShot(png, pathOfImage + '\\image9.png');
    });
  })

  afterAll(async() => {
    pageLogin.navigateTo();
    browser.waitForAngular();
    pageLogin.getButtonLogOut().click();
  })
})
