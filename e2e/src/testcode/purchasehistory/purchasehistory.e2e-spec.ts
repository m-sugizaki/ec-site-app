import { browser, protractor } from 'protractor';
import { ResponsePromise } from 'protractor-http-client/dist/promisewrappers';
import { CommonFuns } from '../../testutils/common.functions';
import { PurchaseHistoryPage } from '../../pageobjects/purchasehistory.po';
import { LoginPage } from '../../pageobjects/login.po';
import { ProductSearchPage } from '../../pageobjects/productSearch.po';
import { ProductDetailPage } from '../../pageobjects/productdetail.po';
import { MySQLDB } from '../../testutils/mysql.db';

describe('Purchase History Page', () => {
  let page: PurchaseHistoryPage;
  let loginPage: LoginPage;
  let productSearchPage: ProductSearchPage;
  let productDetailPage: ProductDetailPage;
  let commonFunction: CommonFuns;
  let pathOfImage: string;
  let mySQLDB: MySQLDB;

  beforeAll(() => {
    browser.driver.manage().window().maximize();
    page = new PurchaseHistoryPage();
    loginPage = new LoginPage();
    productSearchPage = new ProductSearchPage();
    productDetailPage = new ProductDetailPage();
    commonFunction = new CommonFuns();
    mySQLDB = new MySQLDB();

    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    pathOfImage = commonFunction.getRootEvidenceFolderName() + '\\purchasehistory';
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
    mySQLDB.executeSQLSync("TRUNCATE TABLE product");
    mySQLDB.executeSQLWithParams('INSERT INTO product SET ?', data1);
    mySQLDB.executeSQLWithParams('INSERT INTO product SET ?', data2);
    mySQLDB.executeSQLSync("DELETE FROM purchase_results WHERE user_id = '" + browser.params.userForTest + "'");
    mySQLDB.executeSQLSync("DELETE FROM purchase_results WHERE user_id = '" + browser.params.userForTest + "'");
    mySQLDB.executeSQLSync("INSERT INTO purchase_results (user_id, product_id, quantity, size, color, order_dt, order_status, payment_method, payment_no, shipping_address_no, delivery_plan_dt, delivery_completion_dt) "
      + "VALUES ('" + browser.params.userForTest + "', 'TEST101001', 1, '', '白', NOW(), '注文確定', '銀行振込み', 0, 0, TIMESTAMPADD(DAY, 2, CURRENT_DATE), NULL)");
    mySQLDB.executeSQLSync("DELETE FROM product_cart");
  });

  afterAll (() => {
    loginPage.navigateTo();
    browser.waitForAngular();
    loginPage.getButtonLogOut().click();
  });

  it('Should open Purchase History page and display data on Table', async () => {
    let userId = browser.params.userForTest;
    let password = browser.params.passwordOfUserForTest;
    loginPage.navigateTo();
    loginPage.getButtonOpenLoginDialog().click();
    browser.waitForAngular();
    loginPage.getUsername().sendKeys(userId);
    loginPage.getUsername().sendKeys(protractor.Key.TAB);
    commonFunction.waitForSendKeysAngular();
    loginPage.getPassword().click();
    loginPage.getPassword().clear();
    loginPage.getPassword().sendKeys(password);
    commonFunction.waitForSendKeysAngular();

    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image1.png');
    });

    loginPage.getSubmitButton().click();
    browser.waitForAngular();
    browser.waitForAngularEnabled();

    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image2.png');
    });

    productSearchPage.navigateTo();
    browser.waitForAngular();
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image3.png');
    });
    productSearchPage.getButtonSearch().click();
    browser.waitForAngular();
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image4.png');
    });
    productSearchPage.getButtonDetail().click();
    browser.waitForAngular();
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image5.png');
    });
    productDetailPage.getButtonGoToCheckOut().click();
    browser.waitForAngular();
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image6.png');
    });
    page.getButtonPurchaseFromCheckOut().click();
    browser.waitForAngular();
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image7.png');
    });

    page.getLinkToPurchaseHistory().click();
    browser.waitForAngular();
    browser.waitForAngularEnabled();
    let responsePurchaseInfo: ResponsePromise = commonFunction.getDataFromRestAPI("/purchaseresults/getPurchaseResultsInfoByUserIDList/" + userId);
    let resultPurchaseInfo: any = await commonFunction.getJsonDataFromJsonBodyOfResponsePromise(responsePurchaseInfo.jsonBody);
    for (let i = 0; i < resultPurchaseInfo.length; i++) {
      expect(page.getDataTD(i + 1, 1)).toEqual(commonFunction.formatDatetime(resultPurchaseInfo[i].orderDt));
      expect(page.getDataTD(i + 1, 2)).toEqual(resultPurchaseInfo[i].orderNo.toString());
      expect(page.getDataTD(i + 1, 3)).toEqual(resultPurchaseInfo[i].productId);
      expect(page.getDataTD(i + 1, 5)).toEqual(resultPurchaseInfo[i].orderStatus);
      expect(page.getDataTD(i + 1, 6)).toEqual(commonFunction.formatDate(resultPurchaseInfo[i].deliveryPlanDt));
      if (resultPurchaseInfo.length !== 0) {
        let responseProductInfo: ResponsePromise = commonFunction.getDataFromRestAPI("/product/getProductInfoByKey/" + resultPurchaseInfo[i].productId)
        let resultProductInfo: any = await commonFunction.getJsonDataFromJsonBodyOfResponsePromise(responseProductInfo.jsonBody);

        expect(page.getDataTD(i + 1, 4)).toEqual(resultProductInfo.productName);
        let getText: any = await commonFunction.getJsonDataFromJsonBodyOfResponsePromise(page.getDataTD(i + 1, 9));
        if (getText === '修正・削除') {
          let responseLastReviewInfo: ResponsePromise = commonFunction.getDataFromRestAPI("/review/getLastReviewInfoByProductID/" + resultPurchaseInfo[i].productId)
          let resultLastReviewInfo: any = await commonFunction.getJsonDataFromJsonBodyOfResponsePromise(responseLastReviewInfo.jsonBody);
          expect(page.getDataTD(i + 1, 8)).toEqual(commonFunction.getEvaluation(resultLastReviewInfo.evaluation));
        } else {
          expect(page.getDataTD(i + 1, 9)).toEqual('口コミを書く');
          expect(page.getDataTD(i + 1, 8)).toEqual('');
        }

      }
      if (resultPurchaseInfo[i].orderStatus === '注文確定' || resultPurchaseInfo[i].orderStatus === '配達準備中') {
        expect(page.getDataTD(i + 1, 12)).toEqual('注文をキャンセルする');
      }
    }
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image8.png');
    });
  });

  it('Add to Cart, Cancel Order, Open Checkout Dialog', async () => {
    let userId = browser.params.userForTest;
    let status : any;
    let orderNo: any;
    let quantity: any;
    let size = [];
    let color = [];
    var EC = protractor.ExpectedConditions;

    page.getLinkToPurchaseHistory().click();
    browser.waitForAngular();
    browser.waitForAngularEnabled();

    let responseHasProductBefore: ResponsePromise = commonFunction.getDataFromRestAPI(`productcart/getProductCartInfoByUserID/` + userId);
    let resultHasProductBefore: any = await commonFunction.getJsonDataFromJsonBodyOfResponsePromise(responseHasProductBefore.jsonBody);
    page.getAddToCartButton().click();
    browser.waitForAngular();

    let responseHasProductAfter: ResponsePromise = commonFunction.getDataFromRestAPI(`productcart/getProductCartInfoByUserID/` + userId);
    let resultHasProductAfter: any = await commonFunction.getJsonDataFromJsonBodyOfResponsePromise(responseHasProductAfter.jsonBody);
    expect(resultHasProductBefore.length).toBeLessThan(resultHasProductAfter.length);
    expect(resultHasProductAfter.length).toEqual(1);

    status = JSON.parse(mySQLDB.executeSQLSync('SELECT color, size FROM product WHERE product_id = "' + resultHasProductAfter[0].productId + '"'));

    color = status[0].color.split(",");
    size = status[0].size.split(",");
    orderNo = await page.getDataTD(1, 2);
    orderNo = parseInt(orderNo);
    status = JSON.parse(mySQLDB.executeSQLSync('SELECT quantity FROM purchase_results WHERE order_no = ' + orderNo));
    quantity = status[0].quantity;

    expect(resultHasProductAfter[0].userId).toEqual(browser.params.userForTest);
    expect(page.getDataTD(1, 3)).toEqual(resultHasProductAfter[0].productId);
    expect(resultHasProductAfter[0].quantity).toEqual(quantity);
    expect(size).toContain(resultHasProductAfter[0].size);
    expect(color).toContain(resultHasProductAfter[0].color);
    expect(loginPage.getTagHasProductCart().getText()).toEqual('商品カート有無: 有');

    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image9.png');
    });

    page.getCancelOrderButton().click();
    browser.waitForAngular();

    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image10.png');
    });

    page.getCancelOrderButtonFromDialog().click();
    browser.waitForAngular();

    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image11.png');
    });

    page.getConfirmActionButton().click();
    browser.waitForAngular();
    browser.waitForAngularEnabled();
    browser.wait(EC.visibilityOf(page.getDataTDObjectCol(1, 5)), 5000);

    expect(page.getDataTD(1, 5)).toEqual('注文キャンセル');
    orderNo = await page.getDataTD(1, 2);
    orderNo = parseInt(orderNo);
    status = JSON.parse(mySQLDB.executeSQLSync('SELECT order_status FROM purchase_results WHERE order_no = ' + orderNo));
    expect(status.length).toBeGreaterThan(0);
    expect(status[0].order_status).toEqual('注文キャンセル');

    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image12.png');
    });

    page.getGoToCheckOutButton().click();
    browser.waitForAngular();
    browser.waitForAngularEnabled();

    expect(page.getTitleFromCheckOut()).toEqual("商品購入")
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image13.png');
    });
  });
})
