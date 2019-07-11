import { browser, protractor, Key } from 'protractor';
import { ProductSearchPage } from '../../pageobjects/productSearch.po';
import { CommonFuns } from '../../testutils/common.functions';
import { ProductDetailPage } from '../../pageobjects/productdetail.po';
import { LoginPage } from '../../pageobjects/login.po';
import { MySQLDB } from '../../testutils/mysql.db';
import { ResponsePromise } from 'protractor-http-client/dist/promisewrappers';

describe('ECサイト Product Detail', () => {
    let page: ProductDetailPage;
    let pageSearch: ProductSearchPage;
    let pageLogin: LoginPage;
    let cmnFuncs: CommonFuns;
    let pathOfImage: string;
    let mySQLDB: MySQLDB;

    beforeAll(() => {
        browser.driver.manage().window().maximize();
        pageSearch = new ProductSearchPage();
        page = new ProductDetailPage();
        pageLogin = new LoginPage();
        cmnFuncs = new CommonFuns();
        mySQLDB = new MySQLDB();

        pathOfImage = cmnFuncs.getRootEvidenceFolderName() + '\\productdetail';
        cmnFuncs.initEvidenceFolder(pathOfImage);
        cmnFuncs.createUserForTest();

        //データ準備
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
        mySQLDB.executeSQLSync("DELETE FROM product_cart");
        mySQLDB.executeSQLWithParams('INSERT INTO product SET ?', data1);
        mySQLDB.executeSQLWithParams('INSERT INTO product SET ?', data2);
        mySQLDB.executeSQLSync("DELETE FROM review WHERE product_id = 'TEST101001'");
        mySQLDB.executeSQLSync("INSERT INTO review VALUES ('TEST101001', 1,'" + browser.params.userForTest + "', 4, 'よいよい！！！早く買って', '2019-05-22 12:45:07')");
    });

    afterAll(() => {
        pageLogin.navigateTo();
        browser.waitForAngular();
        pageLogin.getButtonLogOut().click();
    });

    it('Product Detail Has Data', async () => {
        let data = {
            productName: '',
            maker: '',
            fromPrice: '',
            toPrice: ''
        }
        let userList: any[] = [];
        let reviewTable: Review[] = [];

        let response = cmnFuncs.postDataToRestAPI('product/searchProductData', data);
        let result: any = await cmnFuncs.getJsonDataFromJsonBodyOfResponsePromise(response.jsonBody);
        let response2 = cmnFuncs.getDataFromRestAPI('review/getReviewOfProduct/' + result[0].primaryKey.productId);
        let resultReview: any = await cmnFuncs.getJsonDataFromJsonBodyOfResponsePromise(response2.jsonBody);
        resultReview.forEach(element => {
            userList.push(element.userId)
        });
        let resultUser: any = []
        if (resultReview.length != 0) {
            let response3 = cmnFuncs.getDataFromRestAPI('user/getUserInfoByUserIdList/' + userList);
            resultUser = await cmnFuncs.getJsonDataFromJsonBodyOfResponsePromise(response3.jsonBody);
        }


        if (resultReview.length != 0) {
            resultReview.forEach(element => {
                resultUser.forEach(element2 => {
                    let review = new Review()
                    if (element.userId === element2.primaryKey.userId) {
                        review.nickname = element2.nickname
                        review.evaluation = element.evaluation
                        review.productId = element.primaryKey.productId
                        review.reviewContent = element.reviewContent
                        review.reviewDt = element.reviewDt
                        review.reviewNo = element.primaryKey.reviewNo
                        review.userId = element.userId
                        reviewTable.push(review)
                    }
                });
            });
        }

        page.navigateTo();
        browser.waitForAngular();
        page.getButtonMenuSearch().click();
        browser.waitForAngular();
        pageSearch.getButtonSearch().click();
        browser.waitForAngular();
        pageSearch.getButtonDetail().click();
        browser.waitForAngular();

        expect(page.getOutputProductId()).toEqual(result[0].primaryKey.productId);
        expect(page.getOutputProductName()).toEqual(result[0].productName);
        expect(page.getOutputMaker()).toEqual(result[0].maker);
        page.getOutputPrice().then(async (value: any) => {
            let price = page.getFormatPrice(value);
            expect(price).toContain(result[0].price + '');
        });
        expect(page.getOutputSalePoint()).toEqual(result[0].salePoint);
        expect(page.getOutputStockQuantity()).toEqual(result[0].stockQuantity + '');
        page.getImage().then((value: string) => {
            let arr: string[] = value.split(',');
            expect(arr[1]).toEqual(result[0].image);
        });

        expect(response2.statusCode).toEqual(200);
        page.getCountTr().then((value: any[]) => {
            expect(value.length).toBe(reviewTable.length);
        });
        for (let i = 0; i < reviewTable.length; i++) {
            expect(page.getTDData(i + 1, 1)).toContain(reviewTable[i].reviewNo);
            expect(page.getTDData(i + 1, 2)).toEqual(reviewTable[i].nickname);
            expect(page.getTDData(i + 1, 3)).toEqual(page.getEvaluation(reviewTable[i].evaluation));
            expect(page.getTDData(i + 1, 4)).toEqual(reviewTable[i].reviewContent);
            expect(page.getTDData(i + 1, 5)).toEqual(cmnFuncs.formatDatetime(reviewTable[i].reviewDt));
        }
        let arrSimilar: any[] = result[0].similarProductId.split(',');
        page.getSimilarProduct().then((value: any) => {
            expect(value.length).toBe(arrSimilar.length);
        });

        page.getSimilarProduct().getText().then((value: any) => {
            for (let i = 0; i < value.length; i++) {
                expect(value[i]).toEqual(arrSimilar[i]);
            }
        });

        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image1.png');
        });

        page.getSelectOptionSize().click();
        browser.waitForAngular();
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image2.png');
        });
        page.getOptionSize().then((value: any) => {
            let size = value.join(',');
            expect(size).toEqual(result[0].size);
        });
        browser.actions().click().perform();
        browser.waitForAngular();

        page.getSelectOptionColor().click();
        browser.waitForAngular();
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image3.png');
        });
        page.getOptionColor().then((value: any) => {
            let color = value.join(',');
            expect(color).toEqual(result[0].color);
        });
        browser.actions().click().perform();
        browser.waitForAngular();

        page.getPurchasePrice().click();
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image4.png');
        });

        if (reviewTable.length != 0) {
            page.getLastTr(reviewTable.length).click();
            browser.takeScreenshot().then(function (png) {
                cmnFuncs.writeScreenShot(png, pathOfImage + '\\image5.png');
            });
        }

    })

    it('Add to cart not login', async () => {
        page.navigateTo();
        browser.waitForAngular();
        page.getButtonMenuSearch().click();
        browser.waitForAngular();
        pageSearch.getButtonSearch().click();
        browser.waitForAngular();
        pageSearch.getButtonDetail().click();
        browser.waitForAngular();
        page.getButtonAddToCart().click();
        browser.waitForAngular();

        expect(page.getSpanWellcome()).toEqual('ようこそゲストさま');
        expect(page.getTitleLoginDialog()).toEqual('ログイン');

        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image6.png');
        });
    })

    it('Add to cart login', async () => {
        let EC = protractor.ExpectedConditions;
        page.navigateTo();
        browser.waitForAngular()
        page.getButtonMenuSearch().click();
        browser.waitForAngular();
        pageSearch.getButtonSearch().click();
        browser.waitForAngular();
        pageSearch.getButtonDetail().click();
        browser.waitForAngular();
        page.getButtonAddToCart().click();
        pageLogin.getUsername().sendKeys(browser.params.userForTest);
        cmnFuncs.waitForSendKeysAngular();
        browser.waitForAngular();
        pageLogin.getPassword().sendKeys(browser.params.passwordOfUserForTest);
        page.getButtonLogin().click();
        cmnFuncs.waitForLoadPage();

        browser.waitForAngular();
        page.getInputQuantity().clear();
        page.getInputQuantity().sendKeys('1');
        browser.waitForAngular();
        page.getInputQuantity().sendKeys(Key.BACK_SPACE);
        page.getButtonAddToCart().click();
        browser.waitForAngular();
        expect(page.getMessage()).toEqual('数量 を入力してください。');
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image7.png');
        });
        page.getInputQuantity().sendKeys('1a');
        page.getButtonAddToCart().click();
        browser.waitForAngular();
        expect(page.getMessage()).toEqual('数量 のフォーマットが正しくないです。');
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image8.png');
        });
        page.getInputQuantity().clear();
        page.getInputQuantity().sendKeys('1');
        page.getButtonAddToCart().click();
        browser.waitForAngular();
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image9.png');
        });

        let response: ResponsePromise = cmnFuncs.getDataFromRestAPI("/user/getUserInfoByUserIdList/" + browser.params.userForTest)
        let value = browser.executeScript("return window.localStorage.getItem('token');");
        let result = await cmnFuncs.getJsonDataFromJsonBodyOfResponsePromise(value);
        let responseLastLogin: ResponsePromise = cmnFuncs.getDataFromRestAPI("/user/getUserLastLoginHistory/" + result)
        let result2: any = await cmnFuncs.getJsonDataFromJsonBodyOfResponsePromise(response.jsonBody);
        let resultLastLogin: any = await cmnFuncs.getJsonDataFromJsonBodyOfResponsePromise(responseLastLogin.jsonBody);
        browser.waitForAngular();

        expect(resultLastLogin.primaryKey.userId).toEqual(browser.params.userForTest)

        let responseHasProduct: ResponsePromise = cmnFuncs.getDataFromRestAPI(`productcart/getProductCartInfoByUserID/` + resultLastLogin.primaryKey.userId)
        let resultHasProduct: any = await cmnFuncs.getJsonDataFromJsonBodyOfResponsePromise(responseHasProduct.jsonBody);
        await browser.wait(EC.presenceOf(pageLogin.getTagHasProductCart()), 5000);
        if (resultHasProduct.length !== 0) {
            expect(pageLogin.getTagHasProductCart().getText()).toEqual('商品カート有無: 有')
        } else {
            expect(pageLogin.getTagHasProductCart().getText()).toEqual('商品カート有無: 無')
        }
        expect(pageLogin.getNickname()).toEqual(`ようこそ${result2[0].name}さま`)
        expect(pageLogin.getLoginDt()).toEqual(`最終ログイン日時: ` + cmnFuncs.formatDatetime(resultLastLogin.primaryKey.loginDt))

        page.getButtonAddToCart().click();
        browser.waitForAngular();

        let responseNew = cmnFuncs.getDataFromRestAPI('productcart/getProductCartInfoByUserID/' + browser.params.userForTest);
        let resultProductCartNew: any = await cmnFuncs.getJsonDataFromJsonBodyOfResponsePromise(responseNew.jsonBody);

        expect(pageLogin.getTagHasProductCart().getText()).toEqual('商品カート有無: 有')
        expect(page.getOutputProductId()).toEqual(resultProductCartNew[0].productId);
        expect(page.getTextOptionSize()).toEqual(resultProductCartNew[0].size);
        expect(page.getTextOptionColor()).toEqual(resultProductCartNew[0].color);
        expect(browser.params.userForTest).toEqual(resultProductCartNew[0].userId);
        expect(page.getQuantity()).toEqual(resultProductCartNew[0].quantity + '');

        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image10.png');
        });

        page.getButtonLogout().click();
    })

    it('Go To CheckoOut not Login', async () => {
        page.navigateTo();
        browser.waitForAngular();
        page.getButtonMenuSearch().click();
        browser.waitForAngular();
        pageSearch.getButtonSearch().click();
        browser.waitForAngular();
        pageSearch.getButtonDetail().click();
        browser.waitForAngular();
        page.getButtonGoToCheckOut().click();
        browser.waitForAngular();

        expect(page.getSpanWellcome()).toEqual('ようこそゲストさま');
        expect(page.getTitleLoginDialog()).toEqual('ログイン');

        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image11.png');
        });
    })


    it('Go To CheckOut Login', async () => {
        let pageLogin: LoginPage = new LoginPage();
        let EC = protractor.ExpectedConditions;
        page.navigateTo();
        browser.waitForAngular()
        page.getButtonMenuSearch().click();
        browser.waitForAngular();
        pageSearch.getButtonSearch().click();
        browser.waitForAngular();
        pageSearch.getButtonDetail().click();
        browser.waitForAngular();
        page.getButtonGoToCheckOut().click();
        pageLogin.getUsername().sendKeys(browser.params.userForTest);
        cmnFuncs.waitForSendKeysAngular();
        browser.waitForAngular();
        pageLogin.getUsername().sendKeys(protractor.Key.TAB);
        pageLogin.getPassword().sendKeys(browser.params.passwordOfUserForTest);
        page.getButtonLogin().click();
        cmnFuncs.waitForLoadPage();
        browser.waitForAngular();

        let response: ResponsePromise = cmnFuncs.getDataFromRestAPI("/user/getUserInfoByUserIdList/" + browser.params.userForTest)
        let value = browser.executeScript("return window.localStorage.getItem('token');");
        let result = await cmnFuncs.getJsonDataFromJsonBodyOfResponsePromise(value);
        let responseLastLogin: ResponsePromise = cmnFuncs.getDataFromRestAPI("/user/getUserLastLoginHistory/" + result)
        let result2: any = await cmnFuncs.getJsonDataFromJsonBodyOfResponsePromise(response.jsonBody);
        let resultLastLogin: any = await cmnFuncs.getJsonDataFromJsonBodyOfResponsePromise(responseLastLogin.jsonBody);
        browser.waitForAngular();

        expect(resultLastLogin.primaryKey.userId).toEqual(browser.params.userForTest)

        let responseHasProduct: ResponsePromise = cmnFuncs.getDataFromRestAPI(`productcart/getProductCartInfoByUserID/` + resultLastLogin.primaryKey.userId)
        let resultHasProduct: any = await cmnFuncs.getJsonDataFromJsonBodyOfResponsePromise(responseHasProduct.jsonBody);
        await browser.wait(EC.presenceOf(pageLogin.getTagHasProductCart()), 5000);
        if (resultHasProduct.length !== 0) {
            expect(pageLogin.getTagHasProductCart().getText()).toEqual('商品カート有無: 有')
        } else {
            expect(pageLogin.getTagHasProductCart().getText()).toEqual('商品カート有無: 無')
        }
        expect(pageLogin.getNickname()).toEqual(`ようこそ${result2[0].name}さま`)
        expect(pageLogin.getLoginDt()).toEqual(`最終ログイン日時: ` + cmnFuncs.formatDatetime(resultLastLogin.primaryKey.loginDt))

        page.getButtonGoToCheckOut().click();
        browser.waitForAngular();

        expect(page.getTitleCheckoutDialog()).toEqual('商品購入');

        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image12.png');
        });
    })

    it('Click link Similar Product', async () => {
        let response = cmnFuncs.getDataFromRestAPI('product/getProductInfoByKey/TEST101001');
        let result: any = await cmnFuncs.getJsonDataFromJsonBodyOfResponsePromise(response.jsonBody);
        let userList: any[] = [];
        let reviewTable: Review[] = [];
        let response2 = cmnFuncs.getDataFromRestAPI('review/getReviewOfProduct/' + result.primaryKey.productId);
        let resultReview: any = await cmnFuncs.getJsonDataFromJsonBodyOfResponsePromise(response2.jsonBody);
        resultReview.forEach(element => {
            userList.push(element.userId)
        });
        let response3 = cmnFuncs.getDataFromRestAPI('user/getUserInfoByUserIdList/' + userList);
        let resultUser: any = await cmnFuncs.getJsonDataFromJsonBodyOfResponsePromise(response3.jsonBody);
        if (resultReview.length != 0) {
            resultReview.forEach(element => {
                resultUser.forEach(element2 => {
                    let review = new Review()
                    if (element.userId === element2.primaryKey.userId) {
                        review.nickname = element2.nickname
                        review.evaluation = element.evaluation
                        review.productId = element.primaryKey.productId
                        review.reviewContent = element.reviewContent
                        review.reviewDt = element.reviewDt
                        review.reviewNo = element.primaryKey.reviewNo
                        review.userId = element.userId
                        reviewTable.push(review)
                    }
                });
            });
        }

        page.navigateTo();
        browser.waitForAngular()
        page.getButtonMenuSearch().click();
        browser.waitForAngular();
        pageSearch.getButtonSearch().click();
        browser.waitForAngular();
        pageSearch.getButtonDetail().click();
        browser.waitForAngular();
        page.getLinksimilarProduct().click();
        browser.waitForAngular();

        expect(page.getOutputProductId()).toEqual(result.primaryKey.productId);
        expect(page.getOutputProductName()).toEqual(result.productName);
        expect(page.getOutputMaker()).toEqual(result.maker);
        page.getOutputPrice().then(async (value: any) => {
            let price = page.getFormatPrice(value);
            expect(price).toContain(result.price + '');
        });
        expect(page.getOutputSalePoint()).toEqual(result.salePoint);
        expect(page.getOutputStockQuantity()).toEqual(result.stockQuantity + '');
        page.getImage().then((value: string) => {
            let arr: string[] = value.split(',');
            expect(arr[1]).toEqual(result.image);
        });

        expect(response2.statusCode).toEqual(200);
        page.getCountTr().then((value: any[]) => {
            expect(value.length).toBe(reviewTable.length);
        });
        for (let i = 0; i < reviewTable.length; i++) {
            expect(page.getTDData(i + 1, 1)).toContain(reviewTable[i].reviewNo);
            expect(page.getTDData(i + 1, 2)).toEqual(reviewTable[i].nickname);
            expect(page.getTDData(i + 1, 3)).toEqual(page.getEvaluation(reviewTable[i].evaluation));
            expect(page.getTDData(i + 1, 4)).toEqual(reviewTable[i].reviewContent);
            expect(page.getTDData(i + 1, 5)).toEqual(cmnFuncs.formatDatetime(reviewTable[i].reviewDt));
        }
        let arrSimilar: any[] = result.similarProductId.split(',');
        page.getSimilarProduct().then((value: any) => {
            expect(value.length).toBe(arrSimilar.length);
        });

        page.getSimilarProduct().getText().then((value: any) => {
            for (let i = 0; i < value.length; i++) {
                expect(value[i]).toEqual(arrSimilar[i]);
            }
        });

        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image13.png');
        });

        page.getSelectOptionSize().click();
        browser.waitForAngular();
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image14.png');
        });
        page.getOptionSize().then((value: any) => {
            let size = value.join(',');
            expect(size).toEqual(result.size);
        });
        browser.actions().click().perform();
        browser.waitForAngular();

        page.getSelectOptionColor().click();
        browser.waitForAngular();
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image15.png');
        });
        page.getOptionColor().then((value: any) => {
            let color = value.join(',');
            expect(color).toEqual(result.color);
        });
        browser.actions().click().perform();
        browser.waitForAngular();

        page.getPurchasePrice().click();
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image16.png');
        });

        page.getLastTr(reviewTable.length).click();
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image17.png');
        });
    })

})

export class Review {
    evaluation: any;
    reviewNo: any;
    productId: any;
    reviewContent: any;
    reviewDt: any;
    nickname: any;
    userId: any;
}
