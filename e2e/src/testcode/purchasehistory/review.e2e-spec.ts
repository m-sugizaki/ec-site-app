import { browser, protractor, Key } from 'protractor';
import { ResponsePromise } from 'protractor-http-client/dist/promisewrappers';
import { CommonFuns } from '../../testutils/common.functions';
import { PurchaseHistoryPage } from '../../pageobjects/purchasehistory.po';
import { LoginPage } from '../../pageobjects/login.po';
import { ReviewDialogPage } from '../../pageobjects/review.po';
import { MySQLDB } from '../../testutils/mysql.db';

describe('Review Page', () => {
  let page: ReviewDialogPage;
  let loginPage: LoginPage;
  let purchasehistoryPage: PurchaseHistoryPage
  let commonFunction: CommonFuns;
  let pathOfImage: string;
  let mySQLDB: MySQLDB;

  beforeAll(() => {
    browser.driver.manage().window().maximize();
    page = new ReviewDialogPage();
    purchasehistoryPage = new PurchaseHistoryPage();
    loginPage = new LoginPage();
    commonFunction = new CommonFuns();
    mySQLDB = new MySQLDB();

    pathOfImage = commonFunction.getRootEvidenceFolderName() + '\\review';
    commonFunction.initEvidenceFolder(pathOfImage);

    //データ準備
    commonFunction.createUserForTest();
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
    mySQLDB.executeSQLSync("DELETE FROM user_store WHERE user_id = 'csvtest2'");
    mySQLDB.executeSQLSync("DELETE FROM user WHERE user_id = 'csvtest2'");
    mySQLDB.executeSQLSync("INSERT INTO user_store VALUES ('csvtest2','123456')");
    mySQLDB.executeSQLSync("INSERT INTO user VALUES ('csvtest2','CSV TEST2','CSV TEST2','111-1111', '都道府県、市町村、丁目番地', " +
              "'ビル、マンションなど', '11111-1111-1111','csvtest2@gmail.com','1988-04-05','一般')");
    mySQLDB.executeSQLSync("TRUNCATE TABLE product");
    mySQLDB.executeSQLWithParams('INSERT INTO product SET ?', data1);
    mySQLDB.executeSQLWithParams('INSERT INTO product SET ?', data2);
    mySQLDB.executeSQLSync("DELETE FROM review WHERE product_id = 'TEST100001'");
    mySQLDB.executeSQLSync("DELETE FROM purchase_results WHERE user_id = '" +  browser.params.userForTest + "'");
    mySQLDB.executeSQLSync("INSERT INTO purchase_results (user_id," +
      "product_id," +
      "quantity," +
      "size," +
      "color," +
      "order_dt," +
      "order_status," +
      "payment_method," +
      "payment_no," +
      "shipping_address_no," +
      "delivery_plan_dt," +
      "delivery_completion_dt)" +
      " VALUES (" +
      "'" + browser.params.userForTest + "'," +
      "'TEST100001'," +
      "2," +
      "'M'," +
      "'赤'," +
      "'2019-05-24'," +
      "'注文確定'," +
      "'銀行振込み'," +
      "0," +
      "0," +
      "'2019-05-26'," +
      "NULL)"
    );
    mySQLDB.executeSQLSync("INSERT INTO review VALUES ('TEST100001', 1, '" + browser.params.userForTest + "', 4, 'よいよい！！！早く買って', '2019-05-22 12:45:07')");
    mySQLDB.executeSQLSync("INSERT INTO review VALUES ('TEST100001', 2, 'csvtest2', 3, '安い！！！早く買って', '2019-05-23 12:40:08')");
  });

  afterAll (() => {
    loginPage.navigateTo();
    browser.waitForAngular();
    loginPage.getButtonLogOut().click();
  });

  it('Should open Review Dialog', async () => {
    let userId = browser.params.userForTest;
    let password = browser.params.passwordOfUserForTest;
    var productId = "TEST100001";
    var nickName = "CSV TEST";
    var reviewNoOfTestUser = 1;
    var hasReviewOfTestUser = false;
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

    var condition = EC.elementToBeClickable(page.getLinkToPurchaseHistory());
    loginPage.getSubmitButton().click();
    browser.wait(condition, 5000);

    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image4.png');
    });

    purchasehistoryPage.getLinkToPurchaseHistory().click();
    browser.waitForAngular();
    browser.waitForAngularEnabled();

    expect(purchasehistoryPage.getDataTD(1 ,3)).toEqual(productId);

    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image5.png');
    });

    purchasehistoryPage.getDataTDObjectCol(1, 9).click();
    browser.waitForAngular();
    browser.waitForAngularEnabled();

    expect(page.getTitle()).toEqual("口コミ情報");
    expect(page.getProductId()).toEqual(productId);

    //Tableデータ確認
    var resultFromDB = JSON.parse(mySQLDB.executeSQLSync("SELECT * FROM review WHERE product_id = '" + productId + "' ORDER BY review_dt DESC"));
    page.getCountTR().then((value:any) => {
      expect(value.length).toBe(resultFromDB.length);
    });
    for(let i = 0; i<resultFromDB.length; i++){
      expect(page.getDataTD(i+1,1)).toEqual(resultFromDB[i].review_no.toString());
      if (resultFromDB[i].review_no === reviewNoOfTestUser) {
        expect(page.getDataTD(i+1,6)).toEqual('削除');
        expect(page.getDataTD(i+1,7)).toEqual('修正');
        expect(page.getDataTD(i+1,2)).toEqual(nickName);
        hasReviewOfTestUser = true;
      } else {
        expect(page.getDataTD(i+1,6)).toEqual('');
        expect(page.getDataTD(i+1,7)).toEqual('');
      }
      expect(page.getDataTD(i+1,3)).toEqual(commonFunction.getEvaluation(resultFromDB[i].evaluation));
      expect(page.getDataTD(i+1,4)).toEqual(resultFromDB[i].review_content);
      expect(page.getDataTD(i+1,5)).toEqual(commonFunction.formatDatetime(resultFromDB[i].review_dt));
    }
    expect(hasReviewOfTestUser).toBeTruthy();

    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image6.png');
    });
  });

  it('Should Open Review Register dialog and Successfully Register', async () => {
    let userId = browser.params.userForTest;
    let password = browser.params.passwordOfUserForTest;
    var productId = "TEST100001";
    var productName = 'B4モバイルノート GSX400R';
    var nickName = "CSV TEST";
    var EC = protractor.ExpectedConditions;

    var resultFromDB = JSON.parse(mySQLDB.executeSQLSync("SELECT * FROM review WHERE product_id = '" + productId + "' ORDER BY review_dt DESC"));

    page.getButtonRegister().click();
    browser.waitForAngular();
    browser.waitForAngularEnabled();

    expect(page.getTitleFromReviewRegister()).toEqual('口コミ登録');
    expect(page.getProductIdFromReviewRegister()).toEqual(productId);
    expect(page.getProductNameFromReviewRegister()).toEqual(productName);
    expect(page.getNicknameFromReviewRegister()).toEqual(nickName);
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image7.png');
    });
    page.getSelectBox().click();
    page.getSelectedItem(3).click();
    page.reviewContent().click();
    page.reviewContent().clear();
    page.reviewContent().sendKeys('安いですが、品質が高い！！！');
    browser.waitForAngular();
    browser.waitForAngularEnabled();
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image8.png');
    });
    page.getButtonSubmitFromReviewRegister().click();
    browser.waitForAngular();
    browser.waitForAngularEnabled();
    browser.wait(EC.visibilityOf(page.getDataTDObjectCol(1, 1)), 5000);

    let responseAllReviewInfo: ResponsePromise = commonFunction.getDataFromRestAPI("/review/getReviewOfProduct/" + productId)
    let resultAllReviewInfo: any = await commonFunction.getJsonDataFromJsonBodyOfResponsePromise(responseAllReviewInfo.jsonBody);
    expect(resultAllReviewInfo.length).toBeGreaterThan(resultFromDB.length)
    let responseLastReviewInfo: ResponsePromise = commonFunction.getDataFromRestAPI("/review/getLastReviewInfoByProductID/" + productId)
    let resultLastReviewInfo: any = await commonFunction.getJsonDataFromJsonBodyOfResponsePromise(responseLastReviewInfo.jsonBody);
    expect(page.getDataTD(1, 1)).toEqual(resultLastReviewInfo.primaryKey.reviewNo.toString());
    expect(page.getDataTD(1, 2)).toEqual(nickName);
    expect(page.getDataTD(1, 3)).toEqual(commonFunction.getEvaluation(resultLastReviewInfo.evaluation));
    expect(page.getDataTD(1, 4)).toEqual(resultLastReviewInfo.reviewContent);
    expect(page.getDataTD(1, 5)).toEqual(commonFunction.formatDatetime(resultLastReviewInfo.reviewDt));
    expect(page.getDataTD(1, 6)).toEqual('削除');
    expect(page.getDataTD(1, 7)).toEqual('修正');
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image9.png');
    });
  });

  it('Should show message Error from Register Dialog', () => {
    page.getButtonRegister().click();
    browser.waitForAngular();
    browser.waitForAngularEnabled();
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image16.png');
    });
    page.getButtonSubmitFromReviewRegister().click();
    browser.waitForAngular();
    browser.waitForAngularEnabled();

    expect(page.getMessage()).toEqual('評価の値を入力してください。');
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image17.png');
    });

    page.getSelectBox().click();
    page.getSelectedItem(3).click();
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image18.png');
    });
    page.getButtonSubmitFromReviewRegister().click();

    expect(page.getMessage()).toEqual('口ｺﾐ内容の値を入力してください。');
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image19.png');
    });
    var EC = protractor.ExpectedConditions;
    page.getButtonCancel().click();
    browser.wait(EC.visibilityOf(page.getDataTDObjectCol(1, 7)), 5000);
  });

  it('Should show message Error from Edit Dialog', () => {
    page.getDataTDObjectCol(1, 7).click();
    browser.waitForAngular();
    browser.waitForAngularEnabled();

    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image20.png');
    });

    page.reviewContent().click();
    page.reviewContent().clear();
    page.reviewContent().sendKeys('1');
    page.reviewContent().sendKeys(Key.BACK_SPACE);
    browser.waitForAngular();
    browser.waitForAngularEnabled();
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image21.png');
    });
    page.getButtonSubmitFromReviewRegister().click();
    expect(page.getMessage()).toEqual('口ｺﾐ内容の値を入力してください。');
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image22.png');
    });
    page.getButtonCancel().click();
  });

  it('Should Open Review Edit dialog and Successfully Edit', async () => {
    var productId = "TEST100001";
    var productName = 'B4モバイルノート GSX400R'
    var nickName = "CSV TEST";
    var reviewNo : any;
    var EC = protractor.ExpectedConditions;

    reviewNo = await page.getDataTD(1, 1);
    reviewNo = parseInt(reviewNo);
    let responseReviewInfoBefore: ResponsePromise = commonFunction.getDataFromRestAPI(`/review/getReviewInfoByKey/${productId}/${reviewNo}`)
    let resultReviewInfoBefore: any = await commonFunction.getJsonDataFromJsonBodyOfResponsePromise(responseReviewInfoBefore.jsonBody);
    page.getDataTDObjectCol(1, 7).click();
    browser.waitForAngular();
    browser.waitForAngularEnabled();

    expect(page.getTitleFromReviewRegister()).toEqual('口コミ更新');
    expect(page.getProductIdFromReviewRegister()).toEqual(resultReviewInfoBefore.primaryKey.productId);
    expect(page.getProductNameFromReviewRegister()).toEqual(productName);
    expect(page.getNicknameFromReviewRegister()).toEqual(nickName);
    expect(page.getSelectBox().getText()).toEqual(commonFunction.getEvaluation(resultReviewInfoBefore.evaluation));
    expect(page.reviewContent().getAttribute('value')).toEqual(resultReviewInfoBefore.reviewContent)
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image10.png');
    });

    page.getSelectBox().click();
    page.getSelectedItem(5).click();
    page.reviewContent().click();
    page.reviewContent().clear();
    page.reviewContent().sendKeys('割引が50％！！！！早く買って');
    browser.waitForAngular();
    browser.waitForAngularEnabled();
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image11.png');
    });
    page.getButtonSubmitFromReviewRegister().click();
    browser.waitForAngular();
    browser.waitForAngularEnabled();
    browser.wait(EC.visibilityOf(page.getDataTDObjectCol(1, 1)), 5000);

    let responseReviewInfo: ResponsePromise = commonFunction.getDataFromRestAPI(`/review/getReviewInfoByKey/${productId}/${reviewNo}`)
    let resultReviewInfo: any = await commonFunction.getJsonDataFromJsonBodyOfResponsePromise(responseReviewInfo.jsonBody);

    expect(page.getDataTD(1, 1)).toEqual(resultReviewInfo.primaryKey.reviewNo.toString());
    expect(page.getDataTD(1, 2)).toEqual(nickName);
    expect(page.getDataTD(1, 3)).toEqual(commonFunction.getEvaluation(resultReviewInfo.evaluation));
    expect(page.getDataTD(1, 4)).toEqual(resultReviewInfo.reviewContent);
    expect(page.getDataTD(1, 5)).toEqual(commonFunction.formatDatetime(resultReviewInfo.reviewDt));
    expect(page.getDataTD(1, 6)).toEqual('削除');
    expect(page.getDataTD(1, 7)).toEqual('修正');
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image12.png');
    });
  });

  it('Should Open dialog Confirm and after click, Successfully Delete a data', async () => {
    var productId = "TEST100001";
    var productName = 'B4モバイルノート GSX400R'
    var nickName = "CSV TEST";
    var reviewNo : any;

    reviewNo = await page.getDataTD(1, 1);
    reviewNo = parseInt(reviewNo);
    var resultFromDB = JSON.parse(mySQLDB.executeSQLSync("SELECT * FROM review WHERE product_id = '" + productId + "' ORDER BY review_dt DESC"));
    page.getDataTDObjectCol(1, 6).click();
    browser.waitForAngular();
    browser.waitForAngularEnabled();
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image13.png');
    });
    page.getConfirmButtonFromConfirmDialog().click();
    browser.waitForAngular();
    browser.waitForAngularEnabled();
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image14.png');
    });
    purchasehistoryPage.getDataTDObjectCol(1, 9).click();
    browser.waitForAngular();
    browser.waitForAngularEnabled();

    let responseAllReviewInfo: ResponsePromise = commonFunction.getDataFromRestAPI("/review/getReviewOfProduct/" + productId)
    let resultAllReviewInfo: any = await commonFunction.getJsonDataFromJsonBodyOfResponsePromise(responseAllReviewInfo.jsonBody);
    expect(resultAllReviewInfo.length).toBeLessThan(resultFromDB.length)
    for (let i = 0; i < resultAllReviewInfo.length; i++) {
      expect(page.getDataTD(i + 1, 1)).not.toEqual(reviewNo.toString());
      expect(resultAllReviewInfo[i].primaryKey.reviewNo).not.toEqual(reviewNo);
    }
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image15.png');
    });
  });

});
