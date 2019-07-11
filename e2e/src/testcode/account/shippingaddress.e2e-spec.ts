import { browser, logging, Key, protractor } from 'protractor';
import { CommonFuns } from '../../testutils/common.functions';
import { LoginPage } from '../../pageobjects/login.po';
import { ResponsePromise } from 'protractor-http-client/dist/promisewrappers';
import { MySQLDB } from '../../testutils/mysql.db';
import { ShippingAddressDialogPage } from '../../pageobjects/shippingaddress';
import { UserInfoPage } from '../../pageobjects/userinfo.po';
import { SignUpPage } from '../../pageobjects/signup.po';
import { UserInfoDialogPage } from '../../pageobjects/userinfodialog.po';
import { ProductSearchPage } from '../../pageobjects/productSearch.po';
import { ProductDetailPage } from '../../pageobjects/productdetail.po';
import { ProductCartBuyDialogPage } from '../../pageobjects/productcartbuydialog.po';

describe('ECサイト Shipping Address', () => {
  let page: ShippingAddressDialogPage;
  let loginPage: LoginPage;
  let userInfoPage: UserInfoPage;
  let signUpPage: SignUpPage;
  let userInfoDialogPage: UserInfoDialogPage;
  let productDetailPage: ProductDetailPage;
  let productSearchPage: ProductSearchPage;
  let productCartBuyPage: ProductCartBuyDialogPage;
  let commonFunction: CommonFuns;
  let pathOfImage: string;
  let mySQLDB: MySQLDB;

  beforeAll(() => {
    browser.driver.manage().window().maximize();
    loginPage = new LoginPage();
    page = new ShippingAddressDialogPage();
    userInfoPage = new UserInfoPage();
    signUpPage = new SignUpPage();
    userInfoDialogPage = new UserInfoDialogPage();
    productDetailPage = new ProductDetailPage();
    productSearchPage = new ProductSearchPage();
    productCartBuyPage = new ProductCartBuyDialogPage();
    commonFunction = new CommonFuns();
    mySQLDB = new MySQLDB();

    pathOfImage = commonFunction.getRootEvidenceFolderName() + '\\shippingaddress';
    commonFunction.initEvidenceFolder(pathOfImage);

    //データ準備
    commonFunction.createUserForTest();
    mySQLDB.executeSQLSync("DELETE FROM shipping_address WHERE user_id = '" + browser.params.userForTest + "' ");
    mySQLDB.executeSQLSync(`INSERT INTO shipping_address (user_id, shipping_address_no, postal_code, address1, address2, phone_number, shipping_address_name)`
      + `VALUES ('` + browser.params.userForTest + `', '1', '111-1111', '都道府県、市町村、丁目番地', '都道府県、市町村、丁目番地', '09112-4952-7644', 'テストユーザのお届け先名')`);
    mySQLDB.executeSQLSync("DELETE FROM user_store WHERE user_id = 'csvtest3' ");
    mySQLDB.executeSQLSync("DELETE FROM user WHERE user_id = 'csvtest3' ");
  });

  afterAll (() => {
    loginPage.navigateTo();
    browser.waitForAngular();
    loginPage.getButtonLogOut().click();
  });

  it('Open Shipping Address and check input data valid', async () => {
    let userId = browser.params.userForTest;
    let password = browser.params.passwordOfUserForTest;
    var EC = protractor.ExpectedConditions;
    var condition = EC.elementToBeClickable(loginPage.getButtonOpenLoginDialog());

    loginPage.navigateTo();
    browser.wait(condition, 5000);

    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image1.png');
    });

    var condition = EC.elementToBeClickable(loginPage.getUsername());
    loginPage.getButtonOpenLoginDialog().click();
    browser.wait(condition, 5000);

    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image2.png');
    });

    loginPage.getUsername().clear();
    loginPage.getUsername().click();
    loginPage.getUsername().sendKeys(userId);
    commonFunction.waitForSendKeysAngular();
    loginPage.getPassword().clear();
    loginPage.getPassword().click();
    loginPage.getPassword().sendKeys(password);
    commonFunction.waitForSendKeysAngular();

    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image3.png');
    });
    browser.waitForAngular();
    loginPage.getSubmitButton().click();
    browser.waitForAngular();
    browser.waitForAngularEnabled();

    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image4.png');
    });
    userInfoPage.getButtonInfoMenu().click();
    browser.waitForAngular();
    browser.waitForAngularEnabled();
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image5.png');
    });
    userInfoPage.getButtonUpdateUserInfo().click();
    browser.waitForAngular();
    browser.waitForAngularEnabled();
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image6.png');
    });
    userInfoPage.getButtonRegisterShippingAddress().click();
    browser.waitForAngular();
    browser.waitForAngularEnabled();

    expect(page.getTitleFromDialogRegister()).toEqual('お届け先情報登録');
    expect(page.getUserIdFromDialog()).toEqual(userId);
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image7.png');
    });
    //==========================================================================
    page.getSubmitButtonFromDialog().click();
    browser.waitForAngular();

    expect(page.getMessage()).toEqual('郵便番号 を入力してください。');
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image8.png');
    });
    //==========================================================================
    page.getPostalCodeFromDialog().sendKeys('12304567');
    page.getSubmitButtonFromDialog().click();
    browser.waitForAngular();

    expect(page.getMessage()).toEqual('住所1 を入力してください。');
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image9.png');
    });
    //==========================================================================
    page.getAddress1FromDialog().sendKeys('都道府県、市町村、丁目番地');
    page.getSubmitButtonFromDialog().click();
    browser.waitForAngular();
    expect(page.getMessage()).toEqual('電話番号 を入力してください。');
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image10.png');
    });
    //==========================================================================
    page.getPhoneNumberFromDialog().sendKeys('111112111121111');
    page.getSubmitButtonFromDialog().click();
    browser.waitForAngular();
    expect(page.getMessage()).toEqual('お届け先名 を入力してください。');
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image11.png');
    });
    //==========================================================================
    page.getShippingAddressNameFromDialog().sendKeys('テストユーザのお届け先名');
    page.getSubmitButtonFromDialog().click();
    browser.waitForAngular();
    expect(page.getMessage()).toEqual('郵便番号のフォーマットが正しくないです。');
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image12.png');
    });
    //==========================================================================
    page.getPostalCodeFromDialog().clear();
    page.getPostalCodeFromDialog().sendKeys('123-4567');
    page.getSubmitButtonFromDialog().click();
    expect(page.getMessage()).toEqual('電話番号のフォーマットが正しくないです。');
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image13.png');
    });
  });

  it('Successfully Register a Shipping Address', async () => {
    let userId = browser.params.userForTest;
    let password = browser.params.passwordOfUserForTest;
    let responseBefore: ResponsePromise = commonFunction.getDataFromRestAPI("/shippingaddress/getShippingAddressInfoByUserID/" + userId)
    let resultBefore: any = await commonFunction.getJsonDataFromJsonBodyOfResponsePromise(responseBefore.jsonBody);
    page.getPhoneNumberFromDialog().click();
    page.getPhoneNumberFromDialog().clear();
    page.getPhoneNumberFromDialog().sendKeys('11111-1111-1111');
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image14.png');
    });
    page.getSubmitButtonFromDialog().click();
    browser.waitForAngular();
    browser.waitForAngularEnabled();

    let responseAfter: ResponsePromise = commonFunction.getDataFromRestAPI("/shippingaddress/getShippingAddressInfoByUserID/" + userId)
    let resultAfter: any = await commonFunction.getJsonDataFromJsonBodyOfResponsePromise(responseAfter.jsonBody);
    expect(resultAfter.length).toBeGreaterThan(resultBefore.length)
    for (let i = 0; i < resultAfter.length; i++) {
      expect(page.getDataTD(i+1,1)).toEqual(resultAfter[i].primaryKey.shippingAddressNo.toString());
      expect(page.getDataTD(i+1,2)).toEqual(resultAfter[i].postalCode);
      expect(page.getDataTD(i+1,3)).toEqual(resultAfter[i].address1);
      expect(page.getDataTD(i+1,4)).toEqual(resultAfter[i].address2);
      expect(page.getDataTD(i+1,5)).toEqual(resultAfter[i].phoneNumber);
      expect(page.getDataTD(i+1,6)).toEqual(resultAfter[i].shippingAddressName);
    }

    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image15.png');
    });
  });

  it('Should Open Edit Dialog and check input data valid', async () => {
    let userId = browser.params.userForTest;
    browser.waitForAngular();
    browser.waitForAngularEnabled();
    page.getButtonFromShippingTd(2, 8).click();
    browser.waitForAngular();
    browser.waitForAngularEnabled();

    expect(page.getTitleFromDialogUpdate().getText()).toEqual('お届け先情報更新');
    expect(page.getUserIdFromDialogUpdate()).toEqual(userId);
    expect(page.getShippingAddressNoFromDialogUpdate()).toEqual(page.getDataTD(2,1))
    expect(page.getPostalCodeFromDialogUpdate().getAttribute('value')).toEqual(page.getDataTD(2,2));
    expect(page.getAddress1FromDialogUpdate().getAttribute('value')).toEqual(page.getDataTD(2,3));
    expect(page.getAddress2FromDialogUpdate().getAttribute('value')).toEqual(page.getDataTD(2,4));
    expect(page.getPhoneNumberFromDialogUpdate().getAttribute('value')).toEqual(page.getDataTD(2,5));
    expect(page.getShippingAddressNameFromDialogUpdate().getAttribute('value')).toEqual(page.getDataTD(2,6));

    //---------------------------------
    page.getPostalCodeFromDialogUpdate().clear();
    page.getPostalCodeFromDialogUpdate().sendKeys('1');
    page.getPostalCodeFromDialogUpdate().sendKeys(Key.BACK_SPACE);
    page.getAddress1FromDialogUpdate().clear();
    page.getAddress1FromDialogUpdate().sendKeys('1');
    page.getAddress1FromDialogUpdate().sendKeys(Key.BACK_SPACE);
    page.getPhoneNumberFromDialogUpdate().clear();
    page.getPhoneNumberFromDialogUpdate().sendKeys('1');
    page.getPhoneNumberFromDialogUpdate().sendKeys(Key.BACK_SPACE);
    page.getShippingAddressNameFromDialogUpdate().clear();
    page.getShippingAddressNameFromDialogUpdate().sendKeys('1');
    page.getShippingAddressNameFromDialogUpdate().sendKeys(Key.BACK_SPACE);
    browser.waitForAngular();
    browser.waitForAngularEnabled();
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image16.png');
    });
    page.getSubmitButtonFromDialogUpdate().click();
    browser.waitForAngular();
    browser.waitForAngularEnabled();
    expect(page.getMessageFromDialogUpdate()).toEqual('郵便番号 を入力してください。');
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image17.png');
    });
    //==========================================================================
    page.getPostalCodeFromDialogUpdate().sendKeys('98764532');
    page.getSubmitButtonFromDialogUpdate().click();
    browser.waitForAngular();

    expect(page.getMessageFromDialogUpdate()).toEqual('住所1 を入力してください。');
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image18.png');
    });
    //==========================================================================
    page.getAddress1FromDialogUpdate().sendKeys('ビル、マンション');
    page.getSubmitButtonFromDialogUpdate().click();
    browser.waitForAngular();
    expect(page.getMessageFromDialogUpdate()).toEqual('電話番号 を入力してください。');
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image19.png');
    });
    //==========================================================================
    page.getPhoneNumberFromDialogUpdate().sendKeys('111112111121111');
    page.getSubmitButtonFromDialogUpdate().click();
    browser.waitForAngular();
    expect(page.getMessageFromDialogUpdate()).toEqual('お届け先名 を入力してください。');
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image20.png');
    });
    //==========================================================================
    page.getShippingAddressNameFromDialogUpdate().sendKeys('テストユーザのお届け先名');
    page.getSubmitButtonFromDialogUpdate().click();
    browser.waitForAngular();
    expect(page.getMessageFromDialogUpdate()).toEqual('郵便番号のフォーマットが正しくないです。');
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image21.png');
    });
    //==========================================================================
    page.getPostalCodeFromDialogUpdate().clear();
    page.getPostalCodeFromDialogUpdate().sendKeys('987-5432');
    page.getSubmitButtonFromDialogUpdate().click();
    browser.waitForAngular();
    expect(page.getMessageFromDialogUpdate()).toEqual('電話番号のフォーマットが正しくないです。');
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image22.png');
    });
  });

  it('Should Edit a Shipping Address success', async () => {
    let userId = browser.params.userForTest;
    let shippingNo: any;

    shippingNo = await page.getShippingAddressNoFromDialogUpdate();
    shippingNo = parseInt(shippingNo);
    let responseBefore: ResponsePromise = commonFunction.getDataFromRestAPI("/shippingaddress/getShippingAddressInfoByUserID/" + userId)
    let resultBefore: any = await commonFunction.getJsonDataFromJsonBodyOfResponsePromise(responseBefore.jsonBody);
    page.getPhoneNumberFromDialogUpdate().clear();
    page.getPhoneNumberFromDialogUpdate().sendKeys('8888-6454-1324');
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image23.png');
    });
    page.getSubmitButtonFromDialogUpdate().click();
    browser.waitForAngular();
    browser.waitForAngularEnabled();

    let responseAfter: ResponsePromise = commonFunction.getDataFromRestAPI("/shippingaddress/getShippingAddressInfoByUserID/" + userId)
    let resultAfter: any = await commonFunction.getJsonDataFromJsonBodyOfResponsePromise(responseAfter.jsonBody);
    expect(resultBefore.length).toEqual(resultAfter.length)
    for (let i = 0; i < resultAfter.length; i++) {
      expect(page.getDataTD(i+1,1)).toEqual(resultAfter[i].primaryKey.shippingAddressNo.toString());
      expect(page.getDataTD(i+1,2)).toEqual(resultAfter[i].postalCode);
      expect(page.getDataTD(i+1,3)).toEqual(resultAfter[i].address1);
      expect(page.getDataTD(i+1,4)).toEqual(resultAfter[i].address2);
      expect(page.getDataTD(i+1,5)).toEqual(resultAfter[i].phoneNumber);
      expect(page.getDataTD(i+1,6)).toEqual(resultAfter[i].shippingAddressName);
    }
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image24.png');
    });
  });

  it('Delete a Shipping Address success', async () => {
    let userId = browser.params.userForTest;

    let responseBefore: ResponsePromise = commonFunction.getDataFromRestAPI("/shippingaddress/getShippingAddressInfoByUserID/" + userId)
    let resultBefore: any = await commonFunction.getJsonDataFromJsonBodyOfResponsePromise(responseBefore.jsonBody);
    page.getButtonFromShippingTd(2, 7).click();
    browser.waitForAngular();
    browser.waitForAngularEnabled();
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image25.png');
    });
    page.getConfirmButtonFromConfirmDialog().click();
    browser.waitForAngular();
    browser.waitForAngularEnabled();

    let responseAfter: ResponsePromise = commonFunction.getDataFromRestAPI("/shippingaddress/getShippingAddressInfoByUserID/" + userId)
    let resultAfter: any = await commonFunction.getJsonDataFromJsonBodyOfResponsePromise(responseAfter.jsonBody);

    expect(resultAfter.length).toBeLessThan(resultBefore.length)
    for (let i = 0; i < resultAfter.length; i++) {
      expect(page.getDataTD(i+1,1)).toEqual(resultAfter[i].primaryKey.shippingAddressNo.toString());
      expect(page.getDataTD(i+1,2)).toEqual(resultAfter[i].postalCode);
      expect(page.getDataTD(i+1,3)).toEqual(resultAfter[i].address1);
      expect(page.getDataTD(i+1,4)).toEqual(resultAfter[i].address2);
      expect(page.getDataTD(i+1,5)).toEqual(resultAfter[i].phoneNumber);
      expect(page.getDataTD(i+1,6)).toEqual(resultAfter[i].shippingAddressName);
    }
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image26.png');
    });
    page.getButtonSubmitFromUserInfoUpdate().click();
  });

  it('Should Open Shipping Address Register from Checkout Dialog', async () => {
    let userId = browser.params.userForTest;
    var EC = protractor.ExpectedConditions;

    productDetailPage.getButtonMenuSearch().click();
    browser.waitForAngular();
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image27.png');
    });
    productSearchPage.getButtonSearch().click();
    browser.waitForAngular();
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image28.png');
    });
    productSearchPage.getButtonDetail().click();
    browser.waitForAngular();
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image29.png');
    });
    productDetailPage.getButtonGoToCheckOut().click();
    browser.waitForAngular();
    var resultFromDB = JSON.parse(mySQLDB.executeSQLSync("SELECT RTRIM(concat(address1, '    ', address2)) address FROM user WHERE user_id = '" + browser.params.userForTest + "'"));
    let listOfAddress = []
    resultFromDB.forEach(element => {
      listOfAddress.push(element.address)
    });
    expect(listOfAddress).toContain(productCartBuyPage.getCurrentShippingAddress());
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image30.png');
    });
    productCartBuyPage.getButtonSignupShippingAddressDialog().click();
    browser.waitForAngular();
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image31.png');
    });
    let newPostalCode = '456-7897'
    let newAddress1 = '都道府県、市町村、丁目番地テスト'
    let newAddress2 = 'ビル、マンションテスト'
    let newPhoneNumber = '12121-2222-3333'
    let newShippingName = 'お届け先テスト'
    let condition = EC.elementToBeClickable(page.getSubmitButtonFromDialog());
    page.getPostalCodeFromDialog().sendKeys(newPostalCode);
    page.getAddress1FromDialog().sendKeys(newAddress1);
    page.getAddress2FromDialog().sendKeys(newAddress2);
    page.getPhoneNumberFromDialog().sendKeys(newPhoneNumber);
    page.getShippingAddressNameFromDialog().sendKeys(newShippingName);
    browser.wait(condition, 5000);

    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image32.png');
    });
    let condition2 = EC.elementToBeClickable(productCartBuyPage.getSelectShipping());
    page.getSubmitButtonFromDialog().click();
    browser.wait(condition2, 2000);

    let condition3 = EC.elementToBeClickable(productCartBuyPage.getDataFromSelectBox('csvtest2'));
    productCartBuyPage.getSelectShipping().click();
    browser.wait(condition3, 2000);

    let responseAllShippingAddress: ResponsePromise = commonFunction.getDataFromRestAPI("/shippingaddress/getShippingAddressInfoByUserID/" + userId)
    let resultAllShippingAddress: any = await commonFunction.getJsonDataFromJsonBodyOfResponsePromise(responseAllShippingAddress.jsonBody);
    expect(resultAllShippingAddress.length).toBeGreaterThan(resultFromDB.length);
    let result: any = await commonFunction.getJsonDataFromJsonBodyOfResponsePromise(productCartBuyPage.getDataFromSelectBox('csvtest2').getText());
    expect(resultAllShippingAddress[1].address1 + '    ' + resultAllShippingAddress[1].address2).toEqual(result);

    productCartBuyPage.getDataFromSelectBox('csvtest2').click();
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image33.png');
    });

    productCartBuyPage.getButtonCancel().click();
    browser.waitForAngular();
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image34.png');
    });
    userInfoPage.getButtonInfoMenu().click();
    browser.waitForAngular();
    expect(userInfoPage.getUserId()).toEqual(userId);
    expect(userInfoPage.getShippingTd(2,2).getText()).toEqual(newPostalCode);
    expect(userInfoPage.getShippingTd(2,3).getText()).toEqual(newAddress1);
    expect(userInfoPage.getShippingTd(2,4).getText()).toEqual(newAddress2);
    expect(userInfoPage.getShippingTd(2,5).getText()).toEqual(newPhoneNumber);
    expect(userInfoPage.getShippingTd(2,6).getText()).toEqual(newShippingName);
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image35.png');
    });
  });

  it('Should Open Shipping Address Edit from Checkout Dialog', async () => {
    let userId = browser.params.userForTest;
    var EC = protractor.ExpectedConditions;
    let updateAddress1 = '都道府県、市町村、丁目番地の更新';
    let updateAddress2 = 'ビル、マンションの更新';
    let condition = EC.elementToBeClickable(page.getSubmitButtonFromDialogUpdate());
    let defaultShippingNo = 1;
    productDetailPage.getButtonMenuSearch().click();
    browser.waitForAngular();
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image36.png');
    });
    productSearchPage.getButtonSearch().click();
    browser.waitForAngular();
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image37.png');
    });
    productSearchPage.getButtonDetail().click();
    browser.waitForAngular();
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image38.png');
    });
    productDetailPage.getButtonGoToCheckOut().click();
    browser.waitForAngular();
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image39.png');
    });
    productCartBuyPage.getButtonUpdateShippingAddressDialog().click();
    browser.waitForAngular();
    let responseShippingAddressByKey: ResponsePromise = commonFunction.getDataFromRestAPI("/shippingaddress/getShippingAddressInfoByKey/" + userId + "/" + defaultShippingNo )
    let resultShippingAddressByKey: any = await commonFunction.getJsonDataFromJsonBodyOfResponsePromise(responseShippingAddressByKey.jsonBody);
    expect(page.getUserIdFromDialogUpdate()).toEqual(userId);
    expect(page.getShippingAddressNoFromDialogUpdate()).toEqual(resultShippingAddressByKey.primaryKey.shippingAddressNo.toString());
    expect(page.getPostalCodeFromDialogUpdate().getAttribute('value')).toEqual(resultShippingAddressByKey.postalCode);
    expect(page.getAddress1FromDialogUpdate().getAttribute('value')).toEqual(resultShippingAddressByKey.address1);
    expect(page.getAddress2FromDialogUpdate().getAttribute('value')).toEqual(resultShippingAddressByKey.address2);
    expect(page.getPhoneNumberFromDialogUpdate().getAttribute('value')).toEqual(resultShippingAddressByKey.phoneNumber);
    expect(page.getShippingAddressNameFromDialogUpdate().getAttribute('value')).toEqual(resultShippingAddressByKey.shippingAddressName);

    page.getAddress1FromDialogUpdate().clear();
    page.getAddress2FromDialogUpdate().clear();
    page.getAddress1FromDialogUpdate().sendKeys(updateAddress1);
    page.getAddress2FromDialogUpdate().sendKeys(updateAddress2);
    browser.wait(condition, 5000);
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image40.png');
    });

    page.getSubmitButtonFromDialogUpdate().click();
    browser.waitForAngular();
    expect(productCartBuyPage.getSpanShipping()).toEqual(updateAddress1 + '    ' + updateAddress2);
    let responseAllShippingAddress: ResponsePromise = commonFunction.getDataFromRestAPI("/shippingaddress/getShippingAddressInfoByUserID/" + userId)
    let resultAllShippingAddress: any = await commonFunction.getJsonDataFromJsonBodyOfResponsePromise(responseAllShippingAddress.jsonBody);
    let result: any = await commonFunction.getJsonDataFromJsonBodyOfResponsePromise(productCartBuyPage.getSpanShipping());
    expect(resultAllShippingAddress[0].address1 + '    ' + resultAllShippingAddress[0].address2).toEqual(result);
    expect(resultAllShippingAddress[0].address1).toEqual(updateAddress1);
    expect(resultAllShippingAddress[0].address2).toEqual(updateAddress2);
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image41.png');
    });

    let condition2 = EC.elementToBeClickable(userInfoPage.getButtonInfoMenu());
    productCartBuyPage.getButtonCancel().click();
    browser.waitForAngular();
    browser.wait(condition2, 5000);
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image42.png');
    });

    userInfoPage.getButtonInfoMenu().click();
    browser.waitForAngular();

    expect(userInfoPage.getUserId()).toEqual(userId);
    expect(userInfoPage.getShippingTd(1,3).getText()).toEqual(updateAddress1);
    expect(userInfoPage.getShippingTd(1,4).getText()).toEqual(updateAddress2);
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image43.png');
    });
  });

  it('Should Open Shipping Address Register from User Info Dialog', () => {
    let userId = 'csvtest3'
    let password = '123456'
    let EC = protractor.ExpectedConditions;
    let condition = EC.elementToBeClickable(signUpPage.getSignUpButtonFromHome());

    loginPage.getButtonLogOut().click();
    browser.wait(condition, 5000);

    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image44.png');
    });

    let condition2 = EC.elementToBeClickable(signUpPage.getUsername());
    signUpPage.getSignUpButtonFromHome().click();
    browser.wait(condition2, 5000);
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image45.png');
    });

    signUpPage.getUsername().clear();
    signUpPage.getUsername().click();
    signUpPage.getUsername().sendKeys(userId);
    signUpPage.getPassword().clear();
    signUpPage.getPassword().click();
    signUpPage.getPassword().sendKeys(password);
    signUpPage.getPasswordConfirm().clear();
    signUpPage.getPasswordConfirm().click();
    signUpPage.getPasswordConfirm().sendKeys(password);

    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image46.png');
    });

    signUpPage.getButtonSubmit().click();
    browser.waitForAngular();
    browser.waitForAngularEnabled();
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image47.png');
    });
    userInfoDialogPage.getName().sendKeys('CSV TEST3');
    userInfoDialogPage.getNickname().sendKeys('CSV TEST3');
    userInfoDialogPage.getPostalCode().sendKeys('123-4564');
    userInfoDialogPage.getAddress1().sendKeys('都道府県、市町村、丁目番地');
    userInfoDialogPage.getPhoneNumber().sendKeys('11111-2222-3333');
    userInfoDialogPage.getEmail().sendKeys('csvtest3@gmail.com');
    userInfoDialogPage.getBirthday().sendKeys('1996/09/03');
    browser.waitForAngular();
    browser.waitForAngularEnabled();
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image48.png');
    });
    userInfoDialogPage.getLinkRegistryShippingAddress().click();
    browser.waitForAngular();
    browser.waitForAngularEnabled();
    expect(page.getUserIdFromDialog()).toEqual(userId)
    expect(page.getTitleFromDialogRegister()).toEqual('お届け先情報登録');
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image49.png');
    });

  });

  it('Successfully Register a Shipping Address from User Info Dialog', async () => {
    let userId = 'csvtest3';
    let EC = protractor.ExpectedConditions;

    page.getPostalCodeFromDialog().sendKeys('456-7897');
    page.getAddress1FromDialog().sendKeys('都道府県、市町村、丁目番地');
    page.getPhoneNumberFromDialog().sendKeys('11111-1111-1111');
    page.getShippingAddressNameFromDialog().sendKeys('お問合せテスト')
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image50.png');
    });
    let condition = EC.elementToBeClickable(userInfoDialogPage.getButtonSubmit());
    page.getSubmitButtonFromDialog().click();
    browser.waitForAngular();
    browser.waitForAngularEnabled();
    browser.wait(condition, 5000);

    let condition2 = EC.elementToBeClickable(userInfoPage.getButtonInfoMenu());
    userInfoDialogPage.getButtonSubmit().click();
    browser.waitForAngular();
    browser.waitForAngularEnabled();
    browser.wait(condition2, 5000);

    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image51.png');
    });
    userInfoPage.getButtonInfoMenu().click();
    browser.waitForAngular();
    browser.waitForAngularEnabled();
    let response: ResponsePromise = commonFunction.getDataFromRestAPI("/shippingaddress/getShippingAddressInfoByUserID/" + userId)
    let result: any = await commonFunction.getJsonDataFromJsonBodyOfResponsePromise(response.jsonBody);

    expect(userInfoPage.getUserId()).toEqual(userId);
    for (let i = 0; i < result.length; i++) {
      expect(userInfoPage.getShippingTd(i+1,1).getText()).toEqual(result[i].primaryKey.shippingAddressNo.toString());
      expect(userInfoPage.getShippingTd(i+1,2).getText()).toEqual(result[i].postalCode);
      expect(userInfoPage.getShippingTd(i+1,3).getText()).toEqual(result[i].address1);
      expect(userInfoPage.getShippingTd(i+1,4).getText()).toEqual(result[i].address2);
      expect(userInfoPage.getShippingTd(i+1,5).getText()).toEqual(result[i].phoneNumber);
      expect(userInfoPage.getShippingTd(i+1,6).getText()).toEqual(result[i].shippingAddressName);
    }
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image52.png');
    });
  });

});
