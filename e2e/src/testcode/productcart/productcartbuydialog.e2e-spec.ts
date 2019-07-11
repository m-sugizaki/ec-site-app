import { browser, Key, protractor } from 'protractor';
import { CommonFuns } from '../../testutils/common.functions';
import { LoginPage } from '../../pageobjects/login.po';
import { ProductCartPage } from '../../pageobjects/productcart.po';
import { ProductSearchPage } from '../..//pageobjects/productSearch.po';
import { ProductDetailPage } from '../../pageobjects/productdetail.po';
import { ResponsePromise } from 'protractor-http-client/dist/promisewrappers';
import { MySQLDB } from '../../testutils/mysql.db';
import { ProductCartBuyDialogPage } from '../../pageobjects/productcartbuydialog.po';
import { async } from '@angular/core/testing';

describe('ECサイト Product Cart Buy Dialog', () => {
    let page: ProductCartBuyDialogPage;
    let cmnFuncs: CommonFuns;
    let pathOfImage: string;
    let pageLogin: LoginPage;
    let mySQLDB: MySQLDB;
    let pageSearch: ProductSearchPage
    let pageDetail: ProductDetailPage
    let pageProductCart: ProductCartPage;

    beforeAll(() => {
        browser.driver.manage().window().maximize();
        pageLogin = new LoginPage();
        page = new ProductCartBuyDialogPage();
        cmnFuncs = new CommonFuns();
        mySQLDB = new MySQLDB();
        pageSearch = new ProductSearchPage();
        pageDetail = new ProductDetailPage();
        pageProductCart = new ProductCartPage();

        pathOfImage = cmnFuncs.getRootEvidenceFolderName() + '\\productcartbuydialog';
        cmnFuncs.initEvidenceFolder(pathOfImage);

        //データ準備
        cmnFuncs.createUserForTest();
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

        var dataPaymentMethod = {
            user_id: browser.params.userForTest,
            payment_no: 1,
            payment_method: '銀行振込み',
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

        mySQLDB.executeSQLSync("DELETE FROM product");
        mySQLDB.executeSQLSync("DELETE FROM purchase_results WHERE user_id = '" + browser.params.userForTest + "'");
        mySQLDB.executeSQLSync("DELETE FROM product_cart WHERE user_id = '" + browser.params.userForTest + "'");
        mySQLDB.executeSQLSync("DELETE FROM payment_method WHERE user_id = '" + browser.params.userForTest + "'");
        mySQLDB.executeSQLSync("DELETE FROM shipping_address WHERE user_id = '" + browser.params.userForTest + "'");
        mySQLDB.executeSQLWithParams('INSERT INTO product SET ?', data1);
        mySQLDB.executeSQLWithParams('INSERT INTO product SET ?', data2);
        mySQLDB.executeSQLWithParams('INSERT INTO payment_method SET ?', dataPaymentMethod);
        mySQLDB.executeSQLWithParams('INSERT INTO shipping_address SET ?', dataShipping);
    });

    afterAll (() => {
      pageLogin.navigateTo();
      browser.waitForAngular();
      pageLogin.getButtonLogOut().click();
    });

    it('Check out from Purchase History page', async () => {
        page.navigateTo();
        browser.waitForAngular();
        page.getButtonLogin().click();
        browser.waitForAngular();
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
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image1.png');
        });

        pageDetail.getButtonMenuSearch().click();
        browser.waitForAngular();
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image2.png');
        });
        pageSearch.getButtonSearch().click();
        browser.waitForAngular();
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image3.png');
        });
        pageSearch.getButtonDetail().click();
        browser.waitForAngular();
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image4.png');
        });
        pageDetail.getButtonGoToCheckOut().click();
        browser.waitForAngular();
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image5.png');
        });
        page.getButtonAcceptCheckOut().click();
        browser.waitForAngular();
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image6.png');
        });
        let responseBefore = cmnFuncs.getDataFromRestAPI('purchaseresults/getPurchaseResultsInfoByUserIDList/' + browser.params.userForTest);
        let resultBefore: any = await cmnFuncs.getJsonDataFromJsonBodyOfResponsePromise(responseBefore.jsonBody);
        let responeProduct = cmnFuncs.getDataFromRestAPI('product/getProductInfoByKey/' + resultBefore[0].productId);
        let resultProduct: any = await cmnFuncs.getJsonDataFromJsonBodyOfResponsePromise(responeProduct.jsonBody);

        page.getButtonMenuPurchase().click();
        browser.waitForAngular();
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image7.png');
        });

        page.getButtonOpenCheckoutOfPurchase().click();
        browser.waitForAngular();
        expect(pageDetail.getTitleCheckoutDialog()).toEqual('商品購入');
        expect(page.getOutputProductId()).toEqual(resultBefore[0].productId);
        expect(page.getOuputQuantity()).toEqual(resultBefore[0].quantity + '');
        expect(page.getSpanSize()).toEqual(resultBefore[0].size);
        expect(page.getSpanColor()).toEqual(resultBefore[0].color);
        expect(page.geOutputProductName()).toEqual(resultProduct.productName);
        page.getOutputPrice().then((value) => {
            let price = page.getFormatPrice(value);
            expect(price).toContain(resultProduct.price + '');
        })
        if (resultBefore[0].paymentMethod == '銀行振込み') {
            expect(page.getRadioBankTransfer().getAttribute('checked')).toBeTruthy();
        } else if (resultBefore[0].paymentMethod == '商品代引き') {
            expect(page.getRadioCOD().getAttribute('checked')).toBeTruthy();
        } else if (resultBefore[0].paymentMethod == 'クレジットカード') {
            expect(page.getRadioCredit().getAttribute('checked')).toBeTruthy();
        }
        if (resultBefore[0].shippingAddressNo == 0) {
            expect(page.getRadioAddressUser().getAttribute('checked')).toBeTruthy();
        } else {
            expect(page.getRadioShippingOther().getAttribute('checked')).toBeTruthy();
        }

        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image8.png');
        });

        page.getButtonAcceptCheckOut().click();
        browser.waitForAngular();
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image9.png');
        });

        let responseAfter = cmnFuncs.getDataFromRestAPI('purchaseresults/getPurchaseResultsInfoByUserIDList/' + browser.params.userForTest);
        let resultAfter: any = await cmnFuncs.getJsonDataFromJsonBodyOfResponsePromise(responseAfter.jsonBody);
        let date = new Date();
        expect(resultBefore.length).toBeLessThan(resultAfter.length);
        expect(resultBefore[0].color).toEqual(resultAfter[1].color);
        expect(resultBefore[0].orderStatus).toEqual('注文確定');
        expect(resultBefore[0].paymentMethod).toEqual(resultAfter[1].paymentMethod);
        expect(resultBefore[0].paymentNo).toEqual(resultAfter[1].paymentNo);
        expect(resultBefore[0].productId).toEqual(resultAfter[1].productId);
        expect(resultBefore[0].quantity).toBe(resultAfter[1].quantity);
        expect(resultBefore[0].shippingAddressNo).toEqual(resultAfter[1].shippingAddressNo);
        expect(resultBefore[0].size).toEqual(resultAfter[1].size);
        expect(resultBefore[0].userId).toEqual(browser.params.userForTest);
        expect(cmnFuncs.formatYYYYMMDD(resultAfter[1].orderDt)).toEqual(cmnFuncs.formatYYYYMMDD(date.toString()));
        date.setDate(date.getDate() + 2);
        expect(cmnFuncs.formatYYYYMMDD(resultAfter[1].deliveryPlanDt)).toEqual(cmnFuncs.formatYYYYMMDD(date.toString()));
    })

    it('Check out from product cart page', async () => {
      var EC = protractor.ExpectedConditions;
        pageDetail.getButtonMenuSearch().click();
        browser.waitForAngular();
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image10.png');
        });
        pageSearch.getButtonSearch().click();
        browser.waitForAngular();
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image11.png');
        });
        pageSearch.getButtonDetail().click();
        browser.waitForAngular();
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image12.png');
        });
        pageDetail.getButtonAddToCart().click();
        browser.waitForAngular();
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image13.png');
        });

        let respone = cmnFuncs.getDataFromRestAPI('productcart/getProductCartInfoByUserID/' + browser.params.userForTest);
        let resultProductCart: any = await cmnFuncs.getJsonDataFromJsonBodyOfResponsePromise(respone.jsonBody);

        let responeProduct = cmnFuncs.getDataFromRestAPI('product/getProductInfoByKey/' + resultProductCart[0].productId);
        let resultProduct: any = await cmnFuncs.getJsonDataFromJsonBodyOfResponsePromise(responeProduct.jsonBody);

        pageProductCart.getButtonProductCart().click();
        browser.waitForAngular();
        pageProductCart.getButtonCheckoutProduct().click();
        browser.waitForAngular();

        expect(pageDetail.getTitleCheckoutDialog()).toEqual('商品購入');
        expect(page.getOutputProductId()).toEqual(resultProductCart[0].productId);
        expect(page.getOuputQuantity()).toEqual(resultProductCart[0].quantity + '');
        expect(page.getSpanColor()).toEqual(resultProductCart[0].color);
        expect(page.getSpanSize()).toEqual(resultProductCart[0].size);
        expect(page.geOutputProductName()).toEqual(resultProduct.productName);
        page.getOutputPrice().then((value) => {
            let price = page.getFormatPrice(value);
            expect(price).toContain(resultProduct.price + '');
        })
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image14.png');
        });

        page.getButtonAcceptCheckOut().click();
        browser.waitForAngular();

        let responseAfter = cmnFuncs.getDataFromRestAPI('purchaseresults/getPurchaseResultsInfoByUserIDList/' + browser.params.userForTest);
        let resultAfter: any = await cmnFuncs.getJsonDataFromJsonBodyOfResponsePromise(responseAfter.jsonBody);

        expect(resultAfter[0].productId).toEqual(resultProductCart[0].productId);
        expect(resultAfter[0].quantity).toBe(resultProductCart[0].quantity);
        expect(resultAfter[0].color).toEqual(resultProductCart[0].color);
        expect(resultAfter[0].size).toEqual(resultProductCart[0].size);
        expect(resultAfter[0].userId).toEqual(browser.params.userForTest);
        expect(resultAfter[0].orderStatus).toEqual('注文確定');
        let date = new Date();
        expect(cmnFuncs.formatYYYYMMDD(resultAfter[0].orderDt)).toEqual(cmnFuncs.formatYYYYMMDD(date.toString()));
        expect(resultAfter[0].shippingAddressNo).toEqual(0);
        expect(resultAfter[0].paymentMethod).toEqual('銀行振込み');
        expect(resultAfter[0].paymentNo).toEqual(0);
        date.setDate(date.getDate() + 2);
        expect(cmnFuncs.formatYYYYMMDD(resultAfter[0].deliveryPlanDt)).toEqual(cmnFuncs.formatYYYYMMDD(date.toString()));

        let responseHasProduct: ResponsePromise = cmnFuncs.getDataFromRestAPI(`productcart/getProductCartInfoByUserID/` + browser.params.userForTest)
        let resultHasProduct: any = await cmnFuncs.getJsonDataFromJsonBodyOfResponsePromise(responseHasProduct.jsonBody);
        await browser.wait( EC.presenceOf(pageLogin.getTagHasProductCart()), 5000 );
        if (resultHasProduct.length !== 0) {
            expect(pageLogin.getTagHasProductCart().getText()).toEqual('商品カート有無: 有')
        } else {
            expect(pageLogin.getTagHasProductCart().getText()).toEqual('商品カート有無: 無')
        }

        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image15.png');
        });
    });

    it('Load check out page from product page', async () => {
        let response: ResponsePromise = cmnFuncs.getDataFromRestAPI("/user/getUserInfoByUserIdList/" + browser.params.userForTest)
        let result2: any = await cmnFuncs.getJsonDataFromJsonBodyOfResponsePromise(response.jsonBody);

        pageDetail.getButtonMenuSearch().click();
        browser.waitForAngular();
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image16.png');
        });
        pageSearch.getButtonSearch().click();
        browser.waitForAngular();
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image17.png');
        });
        pageSearch.getButtonDetail().click();
        browser.waitForAngular();
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image18.png');
        });

        let quantity;
        var productId = 'TEST100001';
        await pageDetail.getQuantity().then((value) => {
            quantity = value;
        })
        pageDetail.getButtonGoToCheckOut().click();
        browser.waitForAngular();

        expect(pageDetail.getTitleCheckoutDialog()).toEqual('商品購入');

        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image19.png');
        });

        let responeProdctDetail = cmnFuncs.getDataFromRestAPI('product/getProductInfoByKey/' + productId);
        let resultProductDetail: any = await cmnFuncs.getJsonDataFromJsonBodyOfResponsePromise(responeProdctDetail.jsonBody);

        expect(page.getOutputProductId()).toEqual(resultProductDetail.primaryKey.productId);
        expect(page.geOutputProductName()).toEqual(resultProductDetail.productName);
        page.getOutputPrice().then((value) => {
            let price = page.getFormatPrice(value);
            expect(price).toContain(resultProductDetail.price + '')
        })

        page.getSelectSize().click();
        browser.waitForAngular();
        await page.getCountOption().then((value: any) => {
            let size = resultProductDetail.size.split(',');
            expect(value.length).toEqual(size.length);
        });
        browser.actions().click().perform();
        browser.waitForAngular();
        var EC = protractor.ExpectedConditions;
        await browser.wait( EC.invisibilityOf(page.getOpionSelect(1)), 5000 );
        page.getSelectColor().click();
        browser.waitForAngular();
        await page.getCountOption().then((value: any) => {
            let color = resultProductDetail.color.split(',');
            expect(value.length).toEqual(color.length);
        });
        browser.actions().click().perform();
        browser.waitForAngular();
        await browser.wait( EC.invisibilityOf(page.getOpionSelect(1)), 5000 );
        expect(quantity).toEqual(page.getOuputQuantity());
        let addressUserInfo = result2[0].address1 + '    ' + result2[0].address2;
        expect(page.getOutputAddress()).toEqual(addressUserInfo);

        let responsePayment = cmnFuncs.getDataFromRestAPI('paymentmethod/getPaymentMethodInfoByUserID/' + browser.params.userForTest);
        let resultPayment: any = await cmnFuncs.getJsonDataFromJsonBodyOfResponsePromise(responsePayment.jsonBody);

        let responseShipping = cmnFuncs.getDataFromRestAPI('shippingaddress/getShippingAddressInfoByUserID/' + browser.params.userForTest);
        let resultShipping: any = await cmnFuncs.getJsonDataFromJsonBodyOfResponsePromise(responseShipping.jsonBody);

        browser.waitForAngular();
        page.getSelectPayment().click();
        browser.waitForAngular();
        browser.waitForAngularEnabled();
        await page.getCountOption().then(async (value: any) => {
            expect(value.length).toEqual(resultPayment.length);
        });

        browser.actions().click().perform();
        browser.waitForAngular();
        expect(page.getSpanPaymentmethod()).toEqual(resultPayment[0].paymentMethod)
        browser.waitForAngularEnabled();
        await browser.wait( EC.invisibilityOf(page.getOpionSelect(1)), 5000 );
        page.getSelectShipping().click();
        browser.waitForAngular();
        await page.getCountOption().then(async (value: any) => {
            expect(value.length).toEqual(resultShipping.length);
        });
        browser.actions().click().perform();
        browser.waitForAngular();

        let addressShipping = resultShipping[0].address1 + '    ' + resultShipping[0].address2;
        expect(page.getSpanShipping()).toEqual(addressShipping);
        var EC = protractor.ExpectedConditions;
        page.getButtonCancel().click();
        browser.waitForAngular();
        browser.wait(EC.elementToBeClickable(pageDetail.getButtonGoToCheckOut()), 5000);
    })

    it('Check Quantity Input Error', async () => {
        pageDetail.getButtonGoToCheckOut().click();
        browser.waitForAngular();
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image21.png');
        });
        page.getInputQuantity().clear();
        browser.waitForAngular();
        page.getInputQuantity().sendKeys('1');
        browser.waitForAngular();
        page.getInputQuantity().sendKeys(Key.BACK_SPACE);
        browser.waitForAngular();
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image22.png');
        });
        page.getButtonAcceptCheckOut().click();
        browser.waitForAngular();
        expect(page.getMessage()).toEqual('数量 を入力してください。');
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image23.png');
        });
        page.getInputQuantity().sendKeys('1a');
        browser.waitForAngular();
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image24.png');
        });
        page.getButtonAcceptCheckOut().click();
        browser.waitForAngular();
        expect(page.getMessage()).toEqual('数量は数値で入力してください。');
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image25.png');
        });
        var EC = protractor.ExpectedConditions;
        page.getButtonCancel().click();
        browser.waitForAngular();
        browser.wait(EC.elementToBeClickable(pageDetail.getButtonGoToCheckOut()), 5000);
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image26.png');
        });
    })

    it('Check Out with 支払方法: 銀行振込み and お届け先 : 現住所', async () => {
        mySQLDB.executeSQLSync("DELETE FROM purchase_results");
        pageDetail.getButtonGoToCheckOut().click();
        browser.waitForAngular();
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image27png');
        });

        let quantity;
        let size;
        let color;
        let productId;

        await page.getOuputQuantity().then((value) => {
            quantity = value;
        })
        await page.getSpanSize().then((value) => {
            size = value;
        })
        await page.getSpanColor().then((value) => {
            color = value;
        })
        await page.getOutputProductId().then((value) => {
            productId = value;
        })
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image28.png');
        });
        var EC = protractor.ExpectedConditions;
        page.getButtonAcceptCheckOut().click();
        browser.waitForAngular();
        browser.wait(EC.elementToBeClickable(pageDetail.getButtonGoToCheckOut()), 5000);

        let response = cmnFuncs.getDataFromRestAPI('purchaseresults/getPurchaseResultsInfoByUserIDList/' + browser.params.userForTest);
        let result: any = await cmnFuncs.getJsonDataFromJsonBodyOfResponsePromise(response.jsonBody);

        expect(result[0].productId).toEqual(productId);
        expect(result[0].orderStatus).toEqual('注文確定');
        expect(result[0].quantity + '').toEqual(quantity);
        expect(result[0].size).toEqual(size);
        expect(result[0].color).toEqual(color)
        expect(result[0].userId).toEqual(browser.params.userForTest);
        expect(result[0].paymentMethod).toEqual('銀行振込み');
        expect(result[0].shippingAddressNo).toBe(0);
        expect(result[0].paymentNo).toBe(0);
        let date = new Date();
        expect(cmnFuncs.formatYYYYMMDD(result[0].orderDt)).toEqual(cmnFuncs.formatYYYYMMDD(date.toString()))

        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image30.png');
        });
    })

    it('Check Out with 支払方法: 商品代引き and お届け先 : 現住所', async () => {
        mySQLDB.executeSQLSync("DELETE FROM purchase_results");
        pageDetail.getButtonGoToCheckOut().click();
        browser.waitForAngular();
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image31.png');
        });

        let quantity;
        let size;
        let color;
        let productId;
        await page.getOuputQuantity().then((value) => {
            quantity = value;
        })
        await page.getSpanSize().then((value) => {
            size = value;
        })
        await page.getSpanColor().then((value) => {
            color = value;
        })
        await page.getOutputProductId().then((value) => {
            productId = value;
        })

        page.getRadioCOD().click();
        browser.waitForAngular();

        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image32.png');
        });
        var EC = protractor.ExpectedConditions;
        page.getButtonAcceptCheckOut().click();
        browser.waitForAngular();
        browser.wait(EC.elementToBeClickable(pageDetail.getButtonGoToCheckOut()), 5000);

        let response = cmnFuncs.getDataFromRestAPI('purchaseresults/getPurchaseResultsInfoByUserIDList/' + browser.params.userForTest);
        let result: any = await cmnFuncs.getJsonDataFromJsonBodyOfResponsePromise(response.jsonBody);

        expect(result[0].productId).toEqual(productId);
        expect(result[0].orderStatus).toEqual('注文確定');
        expect(result[0].quantity + '').toEqual(quantity);
        expect(result[0].size).toEqual(size);
        expect(result[0].color).toEqual(color)
        expect(result[0].userId).toEqual(browser.params.userForTest);
        expect(result[0].paymentMethod).toEqual('商品代引き');
        expect(result[0].shippingAddressNo).toBe(0);
        expect(result[0].paymentNo).toBe(0);
        let date = new Date();
        expect(cmnFuncs.formatYYYYMMDD(result[0].orderDt)).toEqual(cmnFuncs.formatYYYYMMDD(date.toString()));

        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image33.png');
        });
    })

    it('Check Out with 支払方法: クレジットカード and お届け先 : 別のお届け先', async () => {
        mySQLDB.executeSQLSync("DELETE FROM purchase_results");
        pageDetail.getButtonGoToCheckOut().click();
        browser.waitForAngular();
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image34.png');
        });

        let quantity;
        let size;
        let color;
        let productId;
        await page.getOuputQuantity().then((value) => {
            quantity = value;
        })
        await page.getSpanSize().then((value) => {
            size = value;
        })
        await page.getSpanColor().then((value) => {
            color = value;
        })
        await page.getOutputProductId().then((value) => {
            productId = value;
        })


        page.getRadioCredit().click();
        browser.waitForAngular();
        page.getRadioShippingOther().click();
        browser.waitForAngular();
        page.getRadioShippingOther().click();
        browser.waitForAngular();
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image35.png');
        });

        var EC = protractor.ExpectedConditions;
        page.getButtonAcceptCheckOut().click();
        browser.waitForAngular();
        browser.wait(EC.elementToBeClickable(pageDetail.getButtonGoToCheckOut()), 5000);

        let response = cmnFuncs.getDataFromRestAPI('purchaseresults/getPurchaseResultsInfoByUserIDList/' + browser.params.userForTest);
        let result: any = await cmnFuncs.getJsonDataFromJsonBodyOfResponsePromise(response.jsonBody);

        expect(result[0].productId).toEqual(productId);
        expect(result[0].orderStatus).toEqual('注文確定');
        expect(result[0].quantity + '').toEqual(quantity);
        expect(result[0].size).toEqual(size);
        expect(result[0].color).toEqual(color)
        expect(result[0].userId).toEqual(browser.params.userForTest);
        expect(result[0].paymentMethod).toEqual('クレジットカード');
        expect(result[0].shippingAddressNo).toBe(1);
        expect(result[0].paymentNo).toBe(1);
        let date = new Date();
        expect(cmnFuncs.formatYYYYMMDD(result[0].orderDt)).toEqual(cmnFuncs.formatYYYYMMDD(date.toString()));

        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image36.png');
        });
    })

    it('Check Data ShippingAddress and PaymentMethod Empty', async () => {
        mySQLDB.executeSQLSync("DELETE FROM payment_method WHERE user_id = '" + browser.params.userForTest + "'");
        mySQLDB.executeSQLSync("DELETE FROM shipping_address WHERE user_id = '" + browser.params.userForTest + "'");

        pageDetail.getButtonGoToCheckOut().click();
        browser.waitForAngular();
        page.getRadioCredit().click();
        browser.waitForAngular();
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image37.png');
        });
        page.getButtonAcceptCheckOut().click();
        browser.waitForAngular();
        expect(page.getMessage()).toEqual('クレジットカード情報を追加してください。');
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image38.png');
        });
        page.getRadioCOD().click();
        browser.waitForAngular();
        page.getRadioShippingOther().click();
        browser.waitForAngular();
        page.getRadioShippingOther().click();
        browser.waitForAngular();
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image39.png');
        });
        page.getButtonAcceptCheckOut().click();
        browser.waitForAngular();
        expect(page.getMessage()).toEqual('お届け先情報を追加してください。');
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image40.png');
        });
    })
})
