import { browser, logging, Key, protractor } from 'protractor';
import { CommonFuns } from '../../testutils/common.functions';
import { LoginPage } from '../../pageobjects/login.po';
import { ProductCartPage } from '../../pageobjects/productcart.po';
import { ProductSearchPage } from '../..//pageobjects/productSearch.po';
import { ProductDetailPage } from '../../pageobjects/productdetail.po';
import { ResponsePromise } from 'protractor-http-client/dist/promisewrappers';
import { MySQLDB } from '../../testutils/mysql.db';

describe('ECサイト Product Cart', () => {
    let page: ProductCartPage;
    let cmnFuncs: CommonFuns;
    let pathOfImage: string;
    let pageLogin: LoginPage;
    let mySQLDB: MySQLDB;

    beforeAll(() => {
        browser.driver.manage().window().maximize();
        pageLogin = new LoginPage();
        page = new ProductCartPage();
        cmnFuncs = new CommonFuns();
        mySQLDB = new MySQLDB();

        pathOfImage = cmnFuncs.getRootEvidenceFolderName() + '\\productcart';
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
        mySQLDB.executeSQLSync("DELETE FROM product");
        mySQLDB.executeSQLWithParams('INSERT INTO product SET ?', data1);
        mySQLDB.executeSQLWithParams('INSERT INTO product SET ?', data2);
    });

    afterAll(() => {
        pageLogin.navigateTo();
        browser.waitForAngular();
        pageLogin.getButtonLogOut().click();
    });

    it('Check Product Cart Data', async () => {
        let pageSearch: ProductSearchPage = new ProductSearchPage();
        let pageDetail: ProductDetailPage = new ProductDetailPage();
        let EC = protractor.ExpectedConditions;
        page.navigateTo();
        browser.waitForAngular();
        pageLogin.getButtonOpenLoginDialog().click();
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
        pageDetail.getButtonMenuSearch().click();
        browser.waitForAngular();
        let condition = EC.elementToBeClickable(pageSearch.getButtonSearch());
        browser.wait(condition, 5000);
        pageSearch.getButtonSearch().click();
        browser.waitForAngular();
        pageSearch.getButtonDetail().click();
        browser.waitForAngular();
        pageDetail.getButtonAddToCart().click();
        browser.waitForAngular();

        let respone = cmnFuncs.getDataFromRestAPI('productcart/getProductCartInfoByUserID/' + browser.params.userForTest);
        let resultProductCart: any = await cmnFuncs.getJsonDataFromJsonBodyOfResponsePromise(respone.jsonBody);

        let arrProductIdLst: any[] = [];
        resultProductCart.forEach(element => {
            arrProductIdLst.push(element.productId)
        });
        let responseProduct = cmnFuncs.getDataFromRestAPI('product/getProductInfoByProductIDList/' + arrProductIdLst);
        let resultProductList: any = await cmnFuncs.getJsonDataFromJsonBodyOfResponsePromise(responseProduct.jsonBody);

        let productCartList: any[] = [];
        resultProductCart.forEach(element => {
            let pr = new ProductCart();
            pr.product_id = element.productId;
            pr.product_cart_id = element.productCartId;
            pr.quantity = element.quantity;
            pr.size = element.size;
            pr.color = element.color;
            pr.cart_regist_dt = element.cartRegistDt;
            resultProductList.forEach(element2 => {
                if (element.productId === element2.primaryKey.productId) {
                    pr.product_name = element2.productName;
                    pr.price = element2.price;
                    productCartList.push(pr);
                }
            });
        });

        page.getButtonProductCart().click();
        browser.waitForAngular();

        if (resultProductCart.length != 0) {
            expect(page.getSpanProductCart()).toEqual('商品カート有無: 有');
        }
        else {
            expect(page.getSpanProductCart()).toEqual('商品カート有無: 無');
        }

        page.getCountTr().then((value: any) => {
            expect(value.length).toBe(resultProductCart.length);
        })
        for (let i = 0; i < productCartList.length; i++) {
            expect(page.getDataTd(i + 1, 1)).toEqual(productCartList[i].product_cart_id + '');
            expect(page.getDataTd(i + 1, 2)).toEqual(productCartList[i].product_id);
            expect(page.getDataTd(i + 1, 3)).toEqual(productCartList[i].product_name);
            page.getDataTd(i + 1, 4).then(async (value: any) => {
                let price = page.getFormatPrice(value);
                expect(price).toContain(productCartList[i].price + '');
            })
            expect(page.getDataTd(i + 1, 5)).toEqual(productCartList[i].quantity + '');
            page.getDataTd(i + 1, 6).then(async (value: any) => {
                let total = page.getFormatPrice(value);
                expect(total).toContain((productCartList[i].price * productCartList[i].quantity) + '');
            })
            expect(page.getDataTd(i + 1, 7)).toEqual(productCartList[i].size);
            expect(page.getDataTd(i + 1, 8)).toEqual(productCartList[i].color);
            expect(page.getDataTd(i + 1, 9)).toEqual(cmnFuncs.formatDatetime(productCartList[i].cart_regist_dt));
        }

        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image1.png');
        });

        if (resultProductCart.length != 0) {
            page.getButtonUpdateProductCart().click();
            browser.waitForAngular();
            browser.takeScreenshot().then(function (png) {
                cmnFuncs.writeScreenShot(png, pathOfImage + '\\image2.png');
            });
            page.getButronCancleUpdate().click();

            page.getButtonDeleteProductCart().click();
            browser.waitForAngular();
            browser.takeScreenshot().then(function (png) {
                cmnFuncs.writeScreenShot(png, pathOfImage + '\\image3.png');
            });
            page.getButtonCancleDelete().click();

            page.getButtonCheckoutProduct().click();
            browser.waitForAngular();
            browser.takeScreenshot().then(function (png) {
                cmnFuncs.writeScreenShot(png, pathOfImage + '\\image4.png');
            });
            page.getButtonCancleCheckout().click();
        }
    })

    it('Check Data Dialog Update Product Cart', async () => {
        let EC = protractor.ExpectedConditions;
        let productCartId;
        await page.getTdProductCartId().then((value) => {
            productCartId = parseInt(value);
        })
        let respone = cmnFuncs.getDataFromRestAPI('productcart/getProductCartInfoByKey/' + productCartId);
        let result: any = await cmnFuncs.getJsonDataFromJsonBodyOfResponsePromise(respone.jsonBody);

        let responeProduct = cmnFuncs.getDataFromRestAPI('product/getProductInfoByKey/' + result.productId);
        let resultProduct: any = await cmnFuncs.getJsonDataFromJsonBodyOfResponsePromise(responeProduct.jsonBody);

        page.getButtonUpdateProductCart().click();
        browser.waitForAngular();

        expect(page.getTitleDialogUpdate()).toEqual('商品カート更新');
        expect(page.getOutputProductCartId()).toEqual(result.productCartId + '');
        expect(page.getOuputProductId()).toEqual(result.productId);
        expect(page.getOuputProductName()).toEqual(resultProduct.productName);
        page.getOutputPrice().then((value) => {
            let price = page.getFormatPrice(value);
            expect(price).toContain(resultProduct.price);
        })
        expect(page.getOutputSize()).toEqual(result.size);
        expect(page.getOutputColor()).toEqual(result.color);
        expect(page.getOuputQuantity()).toEqual(result.quantity + '');

        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image5.png');
        });
        let condition = EC.elementToBeClickable(page.getButronCancleUpdate());
        browser.wait(condition, 5000);
        page.getButronCancleUpdate().click();
        browser.waitForAngular();
    })

    it('Check Update Product Cart', async () => {
        let EC = protractor.ExpectedConditions;
        let condition = EC.elementToBeClickable(page.getButtonUpdateProductCart());
        browser.wait(condition, 5000);
        page.getButtonUpdateProductCart().click();
        browser.waitForAngular();
        page.getInputQuantity().clear();
        page.getInputQuantity().sendKeys('1');
        page.getInputQuantity().sendKeys(Key.BACK_SPACE);
        browser.waitForAngular();
        page.getButtonAcceptUpdate().click();
        browser.waitForAngular();
        await expect(page.getMessage()).toEqual('数量 を入力してください。');
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image6.png');
        });
        page.getInputQuantity().sendKeys('11aa');
        page.getButtonAcceptUpdate().click();
        browser.waitForAngular();
        expect(page.getMessage()).toEqual('数量 のフォーマットが正しくないです。');
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image7.png');
        });
        page.getInputQuantity().clear();
        page.getInputQuantity().sendKeys('11');
        browser.waitForAngular();
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image8.png');
        });

        page.getSelectSize().click();
        browser.waitForAngular();
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image9.png');
        });
        await page.getCountOption().then((value: any) => {
            if (value.length == 0) {
                page.getOpionSelect(1).click();
            }
            else {
                page.getOpionSelect(value.length).click();
            }
            browser.waitForAngular();
            browser.takeScreenshot().then(function (png) {
                cmnFuncs.writeScreenShot(png, pathOfImage + '\\image10.png');
            });

        })
        browser.waitForAngular();

        page.getSelectColor().click();
        browser.waitForAngular();
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image11.png');
        });
        await page.getCountOption().then((value: any) => {
            if (value.length == 0) {
                page.getOpionSelect(1).click();
            }
            else {
                page.getOpionSelect(value.length).click();
            }
            browser.waitForAngular();
            browser.takeScreenshot().then(function (png) {
                cmnFuncs.writeScreenShot(png, pathOfImage + '\\image12.png');
            });
        })
        browser.waitForAngular();

        let size;
        let color;
        let quantity;
        let productCartId;

        await page.getOuputQuantity().then((value) => {
            quantity = value
        })
        await page.getOutputSize().then((value) => {
            size = value
        })
        await page.getOutputColor().then((value) => {
            color = value
        })
        await page.getTdProductCartId().then((value) => {
            productCartId = parseInt(value)
        })

        page.getButtonAcceptUpdate().click();
        browser.waitForAngular();

        let responeProductCart = cmnFuncs.getDataFromRestAPI('productcart/getProductCartInfoByKey/' + productCartId);
        let result: any = await cmnFuncs.getJsonDataFromJsonBodyOfResponsePromise(responeProductCart.jsonBody);

        expect(productCartId).toBe(result.productCartId);
        expect(size).toEqual(result.size);
        expect(color).toEqual(result.color);
        expect(quantity).toEqual(result.quantity + '');

        let respone = cmnFuncs.getDataFromRestAPI('productcart/getProductCartInfoByUserID/' + browser.params.userForTest);
        let resultProductCart: any = await cmnFuncs.getJsonDataFromJsonBodyOfResponsePromise(respone.jsonBody);

        let arrProductIdLst: any[] = [];
        resultProductCart.forEach(element => {
            arrProductIdLst.push(element.productId)
        });
        let responseProduct = cmnFuncs.getDataFromRestAPI('product/getProductInfoByProductIDList/' + arrProductIdLst);
        let resultProductList: any = await cmnFuncs.getJsonDataFromJsonBodyOfResponsePromise(responseProduct.jsonBody);

        let productCartList: any[] = [];
        resultProductCart.forEach(element => {
            let pr = new ProductCart();
            pr.product_id = element.productId;
            pr.product_cart_id = element.productCartId;
            pr.quantity = element.quantity;
            pr.size = element.size;
            pr.color = element.color;
            pr.cart_regist_dt = element.cartRegistDt;
            resultProductList.forEach(element2 => {
                if (element.productId === element2.primaryKey.productId) {
                    pr.product_name = element2.productName;
                    pr.price = element2.price;
                    productCartList.push(pr);
                }
            });
        });

        if (resultProductCart.length != 0) {
            expect(page.getSpanProductCart()).toEqual('商品カート有無: 有');
        }
        else {
            expect(page.getSpanProductCart()).toEqual('商品カート有無: 無');
        }

        page.getCountTr().then((value: any) => {
            expect(value.length).toBe(resultProductCart.length);
        })
        for (let i = 0; i < productCartList.length; i++) {
            expect(page.getDataTd(i + 1, 1)).toEqual(productCartList[i].product_cart_id + '');
            expect(page.getDataTd(i + 1, 2)).toEqual(productCartList[i].product_id);
            expect(page.getDataTd(i + 1, 3)).toEqual(productCartList[i].product_name);
            page.getDataTd(i + 1, 4).then(async (value: any) => {
                let price = page.getFormatPrice(value);
                expect(price).toContain(productCartList[i].price + '');
            })
            expect(page.getDataTd(i + 1, 5)).toEqual(productCartList[i].quantity + '');
            page.getDataTd(i + 1, 6).then(async (value: any) => {
                let total = page.getFormatPrice(value);
                expect(total).toContain((productCartList[i].price * productCartList[i].quantity) + '');
            })
            expect(page.getDataTd(i + 1, 7)).toEqual(productCartList[i].size);
            expect(page.getDataTd(i + 1, 8)).toEqual(productCartList[i].color);
            expect(page.getDataTd(i + 1, 9)).toEqual(cmnFuncs.formatDatetime(productCartList[i].cart_regist_dt));
        }

        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image13.png');
        });
    })

    it('Delete Product Cart Data', async () => {
        let responeResult = cmnFuncs.getDataFromRestAPI('productcart/getProductCartInfoByUserID/' + browser.params.userForTest);
        let result: any = await cmnFuncs.getJsonDataFromJsonBodyOfResponsePromise(responeResult.jsonBody);

        browser.waitForAngular();
        await page.getCountTr().then((value: any) => {
            expect(value.length).toBe(result.length);
        })

        if (result.length != 0) {
            let EC = protractor.ExpectedConditions;
            let condition = EC.elementToBeClickable(page.getButtonDeleteProductCart());
            browser.wait(condition, 5000);
            page.getButtonDeleteProductCart().click();
            browser.waitForAngular();
            browser.takeScreenshot().then(function (png) {
                cmnFuncs.writeScreenShot(png, pathOfImage + '\\image14.png');
            });
            page.getButtonAcceptDelete().click();
            browser.waitForAngular();
            browser.takeScreenshot().then(function (png) {
                cmnFuncs.writeScreenShot(png, pathOfImage + '\\image15.png');
            });
        }

        let respone = cmnFuncs.getDataFromRestAPI('productcart/getProductCartInfoByUserID/' + browser.params.userForTest);
        let resultProductCart: any = await cmnFuncs.getJsonDataFromJsonBodyOfResponsePromise(respone.jsonBody);

        let arrProductIdLst: any[] = [];
        resultProductCart.forEach(element => {
            arrProductIdLst.push(element.productId)
        });
        let responseProduct = cmnFuncs.getDataFromRestAPI('product/getProductInfoByProductIDList/' + arrProductIdLst);
        let resultProductList: any = await cmnFuncs.getJsonDataFromJsonBodyOfResponsePromise(responseProduct.jsonBody);

        let productCartList: any[] = [];
        resultProductCart.forEach(element => {
            let pr = new ProductCart();
            pr.product_id = element.productId;
            pr.product_cart_id = element.productCartId;
            pr.quantity = element.quantity;
            pr.size = element.size;
            pr.color = element.color;
            pr.cart_regist_dt = element.cartRegistDt;
            resultProductList.forEach(element2 => {
                if (element.productId === element2.primaryKey.productId) {
                    pr.product_name = element2.productName;
                    pr.price = element2.price;
                    productCartList.push(pr);
                }
            });
        });

        if (resultProductCart.length != 0) {
            expect(page.getSpanProductCart()).toEqual('商品カート有無: 有');
        }
        else {
            expect(page.getSpanProductCart()).toEqual('商品カート有無: 無');
        }

        page.getCountTr().then((value: any) => {
            expect(value.length).toBe(resultProductCart.length);
        })
        for (let i = 0; i < productCartList.length; i++) {
            expect(page.getDataTd(i + 1, 1)).toEqual(productCartList[i].product_cart_id + '');
            expect(page.getDataTd(i + 1, 2)).toEqual(productCartList[i].product_id);
            expect(page.getDataTd(i + 1, 3)).toEqual(productCartList[i].product_name);
            page.getDataTd(i + 1, 4).then(async (value: any) => {
                let price = page.getFormatPrice(value);
                expect(price).toContain(productCartList[i].price + '');
            })
            expect(page.getDataTd(i + 1, 5)).toEqual(productCartList[i].quantity + '');
            page.getDataTd(i + 1, 6).then(async (value: any) => {
                let total = page.getFormatPrice(value);
                expect(total).toContain((productCartList[i].price * productCartList[i].quantity) + '');
            })
            expect(page.getDataTd(i + 1, 7)).toEqual(productCartList[i].size);
            expect(page.getDataTd(i + 1, 8)).toEqual(productCartList[i].color);
            expect(page.getDataTd(i + 1, 9)).toEqual(cmnFuncs.formatDatetime(productCartList[i].cart_regist_dt));
        }
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image16.png');
        });
    })

    it('Check Product Cart Checkout', async () => {
        let responeResult = cmnFuncs.getDataFromRestAPI('productcart/getProductCartInfoByUserID/' + browser.params.userForTest);
        let result: any = await cmnFuncs.getJsonDataFromJsonBodyOfResponsePromise(responeResult.jsonBody);
        let responsePurchaseInfo: ResponsePromise = cmnFuncs.getDataFromRestAPI("/purchaseresults/getPurchaseResultsInfoByUserIDList/" + browser.params.userForTest)
        let resultPurchaseInfo: any = await cmnFuncs.getJsonDataFromJsonBodyOfResponsePromise(responsePurchaseInfo.jsonBody);

        await page.getCountTr().then((value: any) => {
            expect(value.length).toBe(result.length);
        })

        if (result.length != 0) {
            page.getButtonCheckoutProduct().click();
            browser.waitForAngular();
            expect(page.getTitileCheckoutDialog()).toEqual('商品購入')
            browser.takeScreenshot().then(function (png) {
                cmnFuncs.writeScreenShot(png, pathOfImage + '\\image17.png');
            });
            page.getButtonAcceptCheckOut().click();
            browser.waitForAngular();
            browser.takeScreenshot().then(function (png) {
                cmnFuncs.writeScreenShot(png, pathOfImage + '\\image18.png');
            });

            let responsePurchaseInfo2: ResponsePromise = cmnFuncs.getDataFromRestAPI("/purchaseresults/getPurchaseResultsInfoByUserIDList/" + browser.params.userForTest)
            let resultPurchaseInfo2: any = await cmnFuncs.getJsonDataFromJsonBodyOfResponsePromise(responsePurchaseInfo2.jsonBody);

            expect(resultPurchaseInfo2.length).toBe(resultPurchaseInfo.length + 1);
        }

        let respone = cmnFuncs.getDataFromRestAPI('productcart/getProductCartInfoByUserID/' + browser.params.userForTest);
        let resultProductCart: any = await cmnFuncs.getJsonDataFromJsonBodyOfResponsePromise(respone.jsonBody);

        let arrProductIdLst: any[] = [];
        resultProductCart.forEach(element => {
            arrProductIdLst.push(element.productId)
        });
        let responseProduct = cmnFuncs.getDataFromRestAPI('product/getProductInfoByProductIDList/' + arrProductIdLst);
        let resultProductList: any = await cmnFuncs.getJsonDataFromJsonBodyOfResponsePromise(responseProduct.jsonBody);

        let productCartList: any[] = [];
        resultProductCart.forEach(element => {
            let pr = new ProductCart();
            pr.product_id = element.productId;
            pr.product_cart_id = element.productCartId;
            pr.quantity = element.quantity;
            pr.size = element.size;
            pr.color = element.color;
            pr.cart_regist_dt = element.cartRegistDt;
            resultProductList.forEach(element2 => {
                if (element.productId === element2.primaryKey.productId) {
                    pr.product_name = element2.productName;
                    pr.price = element2.price;
                    productCartList.push(pr);
                }
            });
        });

        if (resultProductCart.length != 0) {
            expect(page.getSpanProductCart()).toEqual('商品カート有無: 有');
        }
        else {
            expect(page.getSpanProductCart()).toEqual('商品カート有無: 無');
        }

        page.getCountTr().then((value: any) => {
            expect(value.length).toBe(resultProductCart.length);
        })
        for (let i = 0; i < productCartList.length; i++) {
            expect(page.getDataTd(i + 1, 1)).toEqual(productCartList[i].product_cart_id + '');
            expect(page.getDataTd(i + 1, 2)).toEqual(productCartList[i].product_id);
            expect(page.getDataTd(i + 1, 3)).toEqual(productCartList[i].product_name);
            page.getDataTd(i + 1, 4).then(async (value: any) => {
                let price = page.getFormatPrice(value);
                expect(price).toContain(productCartList[i].price + '');
            })
            expect(page.getDataTd(i + 1, 5)).toEqual(productCartList[i].quantity + '');
            page.getDataTd(i + 1, 6).then(async (value: any) => {
                let total = page.getFormatPrice(value);
                expect(total).toContain((productCartList[i].price * productCartList[i].quantity) + '');
            })
            expect(page.getDataTd(i + 1, 7)).toEqual(productCartList[i].size);
            expect(page.getDataTd(i + 1, 8)).toEqual(productCartList[i].color);
            expect(page.getDataTd(i + 1, 9)).toEqual(cmnFuncs.formatDatetime(productCartList[i].cart_regist_dt));
        }
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image19.png');
        });
    })
})

export class ProductCart {
    product_cart_id: any
    product_id: any
    product_name: any
    price: any
    quantity: any
    size: any
    color: any
    cart_regist_dt: any
}
