
import { browser, logging } from 'protractor';
import { ProductSearchPage } from '../../pageobjects/productSearch.po';
import { CommonFuns } from '../../testutils/common.functions';
import { MySQLDB } from '../../testutils/mysql.db';

describe('ECサイト Product Search', () => {
    let page: ProductSearchPage;
    let cmnFuncs: CommonFuns;
    let pathOfImage: string;
    let mySQLDB: MySQLDB;

    beforeAll(() => {
        browser.driver.manage().window().maximize();
        page = new ProductSearchPage();
        cmnFuncs = new CommonFuns();
        mySQLDB = new MySQLDB();

        pathOfImage = cmnFuncs.getRootEvidenceFolderName() + '\\productsearch';
        cmnFuncs.initEvidenceFolder(pathOfImage);

        //データ準備
        var path = require('path');
        var fs = require("fs");
        var imgPath = path.resolve(__dirname, '../../testutils/imgs/imagetest.png');
        var imgVal = fs.readFileSync(imgPath);
        var data1 = {
            product_id:'TEST100001',
            product_name:'B4モバイルノート GSX400R',
            maker:'PC工房',
            price:128000,
            size:'XL,X,M',
            color:'Black,White,Silver',
            sale_point:'格安ハイスペックPC！ 普段使いにストレスを感じさせません！！！',
            image:imgVal,
            stock_quantity:99,
            similar_product_id:'TEST101001,TEST10002'
        }
        var data2 = {
            product_id:'TEST101001',
            product_name:'5G対応 6.5型大画面スマートフォン RVG250',
            maker:'PC工房',
            price:98000,
            size:'',
            color:'白',
            sale_point:'先行発売！ ハンドメイドのため台数限定です。お申し込みはお早めに！！！',
            image:imgVal,
            stock_quantity:200,
            similar_product_id:'TEST101002,TEST101003'
        }
        mySQLDB.executeSQLSync("DELETE FROM product");
        mySQLDB.executeSQLWithParams('INSERT INTO product SET ?', data1);
        mySQLDB.executeSQLWithParams('INSERT INTO product SET ?', data2);
    });

    it('should display title: 商品検索', () => {
        page.navigateTo();
        browser.waitForAngular();
        expect(page.getTitleText()).toEqual('商品検索');
        expect(page.getUrl()).toEqual(browser.baseUrl + '/#/search');
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image1.png');
        });
    })

    it('Search All Data No Input', async () => {
        let data = {
            "productName": '',
            "maker": '',
            "fromPrice": '',
            "toPrice": ''
        }

        let response = cmnFuncs.postDataToRestAPI('product/searchProductData', data);
        let result: any = await cmnFuncs.getJsonDataFromJsonBodyOfResponsePromise(response.jsonBody);

        page.navigateTo();
        browser.waitForAngular();
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image2.png');
        });
        page.getButtonSearch().click();
        browser.waitForAngular();

        page.getCountTR().then((value:any) => {
            expect(value.length).toBe(result.length);
        })
        for(let i = 0; i<result.length; i++){
            expect(page.getDataTD(i+1,1)).toEqual(result[i].primaryKey.productId);
            expect(page.getDataTD(i+1,2)).toEqual(result[i].productName);
            expect(page.getDataTD(i+1,3)).toEqual(result[i].maker);
            page.getDataTD(i+1,4).then(async(value : any) => {
                let price = page.getFormatPrice(value);
                expect(price).toContain(result[i].price + '');
            })
        }

        expect(response.statusCode).toEqual(200);
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image3.png');
        });
    })

    it('Search Product Name', async () => {
        let data = {
            "productName": 'B4モバイルノート GSX400R',
            "maker": '',
            "fromPrice": '',
            "toPrice": ''
        }

        let response = cmnFuncs.postDataToRestAPI('product/searchProductData', data);
        let result: any = await cmnFuncs.getJsonDataFromJsonBodyOfResponsePromise(response.jsonBody);

        page.navigateTo();
        browser.waitForAngular();
        page.getInputProductName().sendKeys('B4モバイルノート GSX400R');
        browser.waitForAngular();
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image4.png');
        });
        page.getButtonSearch().click();
        browser.waitForAngular();

        page.getCountTR().then((value:any) => {
            expect(value.length).toBe(result.length);
        })
        expect(response.statusCode).toEqual(200);
        for(let i = 0; i<result.length; i++){
                expect(page.getDataTD(i+1,1)).toEqual(result[i].primaryKey.productId);
                expect(page.getDataTD(i+1,2)).toEqual(result[i].productName);
                expect(page.getDataTD(i+1,3)).toEqual(result[i].maker);
                page.getDataTD(i+1,4).then(async(value : any) => {
                    let price = page.getFormatPrice(value);
                    expect(price).toContain(result[i].price + '');
                })
        }


        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image5.png');
        });
    })

    it('Search Product By Maker', async () => {
        let data = {
            "productName": '',
            "maker": 'PC工房',
            "fromPrice": '',
            "toPrice": ''
        }

        let response = cmnFuncs.postDataToRestAPI('product/searchProductData', data);
        let result: any = await cmnFuncs.getJsonDataFromJsonBodyOfResponsePromise(response.jsonBody);

        page.navigateTo();
        browser.waitForAngular();
        page.getInputMaker().sendKeys('PC工房');
        browser.waitForAngular();
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image6.png');
        });
        page.getButtonSearch().click();
        browser.waitForAngular();


        page.getCountTR().then((value:any) => {
            expect(value.length).toBe(result.length);
        })

        expect(response.statusCode).toEqual(200);
        for(let i = 0; i<result.length; i++){
                expect(page.getDataTD(i+1,1)).toEqual(result[i].primaryKey.productId);
                expect(page.getDataTD(i+1,2)).toEqual(result[i].productName);
                expect(page.getDataTD(i+1,3)).toEqual(result[i].maker);
                page.getDataTD(i+1,4).then(async(value : any) => {
                    let price = page.getFormatPrice(value);
                    expect(price).toContain(result[i].price + '');
                })
        }


        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image7.png');
        });
    })

    it('Search Product By From Price', async () => {
        let data = {
            "productName": '',
            "maker": '',
            "fromPrice": '98000',
            "toPrice": ''
        }

        let response = cmnFuncs.postDataToRestAPI('product/searchProductData', data);
        let result: any = await cmnFuncs.getJsonDataFromJsonBodyOfResponsePromise(response.jsonBody);

        page.navigateTo();
        browser.waitForAngular();
        page.getInputFromPrice().sendKeys('98000');
        browser.waitForAngular();
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image8.png');
        });
        page.getButtonSearch().click();
        browser.waitForAngular();


        page.getCountTR().then((value:any) => {
            expect(value.length).toBe(result.length);
        })
        expect(response.statusCode).toEqual(200);
        for(let i = 0; i<result.length; i++){
                expect(page.getDataTD(i+1,1)).toEqual(result[i].primaryKey.productId);
                expect(page.getDataTD(i+1,2)).toEqual(result[i].productName);
                expect(page.getDataTD(i+1,3)).toEqual(result[i].maker);
                page.getDataTD(i+1,4).then(async(value : any) => {
                    let price = page.getFormatPrice(value);
                    expect(price).toContain(result[i].price + '');
                })
        }


        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image9.png');
        });
    })

    it('Search Product By To Price', async () => {
        let data = {
            "productName": '',
            "maker": '',
            "fromPrice": '',
            "toPrice": '128000'
        }

        let response = cmnFuncs.postDataToRestAPI('product/searchProductData', data);
        let result: any = await cmnFuncs.getJsonDataFromJsonBodyOfResponsePromise(response.jsonBody);

        page.navigateTo();
        browser.waitForAngular();
        page.getInputToPrice().sendKeys('128000');
        browser.waitForAngular();
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image10.png');
        });
        page.getButtonSearch().click();
        browser.waitForAngular();


        page.getCountTR().then((value:any) => {
            expect(value.length).toBe(result.length);
        })
        expect(response.statusCode).toEqual(200);
        for(let i = 0; i<result.length; i++){
                expect(page.getDataTD(i+1,1)).toEqual(result[i].primaryKey.productId);
                expect(page.getDataTD(i+1,2)).toEqual(result[i].productName);
                expect(page.getDataTD(i+1,3)).toEqual(result[i].maker);
                page.getDataTD(i+1,4).then(async(value : any) => {
                    let price = page.getFormatPrice(value);
                    expect(price).toContain(result[i].price + '');
                })
        }


        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image11.png');
        });
    })

    it('Search Product By All Input', async () => {
        let data = {
            "productName": 'B4モバイルノート GSX400R',
            "maker": 'PC工房',
            "fromPrice": '98000',
            "toPrice": '128000'
        }

        let response = cmnFuncs.postDataToRestAPI('product/searchProductData', data);
        let result: any = await cmnFuncs.getJsonDataFromJsonBodyOfResponsePromise(response.jsonBody);

        page.navigateTo();
        browser.waitForAngular();
        page.getInputProductName().sendKeys('B4モバイルノート GSX400R');
        page.getInputMaker().sendKeys('PC工房')
        page.getInputFromPrice().sendKeys('98000')
        page.getInputToPrice().sendKeys('128000');
        browser.waitForAngular();
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image12.png');
        });
        page.getButtonSearch().click();
        browser.waitForAngular();


        page.getCountTR().then((value:any) => {
            expect(value.length).toBe(result.length);
        })
        expect(response.statusCode).toEqual(200);
        for(let i = 0; i<result.length; i++){
                expect(page.getDataTD(i+1,1)).toEqual(result[i].primaryKey.productId);
                expect(page.getDataTD(i+1,2)).toEqual(result[i].productName);
                expect(page.getDataTD(i+1,3)).toEqual(result[i].maker);
                page.getDataTD(i+1,4).then(async(value : any) => {
                    let price = page.getFormatPrice(value);
                    expect(price).toContain(result[i].price + '');
                })
        }


        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image13.png');
        });
    })

    it('Search Product By All Input No Data', async () => {
        let data = {
            "productName": 'ああああああああ',
            "maker": 'PC工房',
            "fromPrice": '98000',
            "toPrice": '128000'
        }

        let response = cmnFuncs.postDataToRestAPI('product/searchProductData', data);
        let result: any = await cmnFuncs.getJsonDataFromJsonBodyOfResponsePromise(response.jsonBody);

        page.navigateTo();
        browser.waitForAngular();
        page.getInputProductName().sendKeys('ああああああああ');
        page.getInputMaker().sendKeys('PC工房')
        page.getInputFromPrice().sendKeys('98000')
        page.getInputToPrice().sendKeys('128000');
        browser.waitForAngular();
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image14.png');
        });
        page.getButtonSearch().click();
        browser.waitForAngular();


        expect(result.length).toBe(0);
        expect(response.statusCode).toEqual(200);
        expect(page.getMessage()).toEqual('データがありません。');
        page.getCountTR().then((value : any) => {
            expect(value.length).toBe(0);
        })


        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image15.png');
        });
    })

    it('Search Product FromPrice is greater than ToPrice Error', async () => {
        let data = {
            "productName": '',
            "maker": '',
            "fromPrice": '130000',
            "toPrice": '128000'
        }

        let response = cmnFuncs.postDataToRestAPI('product/searchProductData', data);
        let result: any = await cmnFuncs.getJsonDataFromJsonBodyOfResponsePromise(response.jsonBody);

        page.navigateTo();
        browser.waitForAngular();
        page.getInputProductName().sendKeys('B4モバイルノート GSX400R_RRR');
        page.getInputMaker().sendKeys('PC工房')
        page.getInputFromPrice().sendKeys('130000')
        page.getInputToPrice().sendKeys('128000');
        browser.waitForAngular();
        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image16.png');
        });
        page.getButtonSearch().click();
        browser.waitForAngular();

        expect(response.statusCode).toEqual(200);
        expect(result.length).toBe(0);
        expect(page.getErrorMessage()).toEqual('価格Fromの値は価格Toより大きいです。再入力してください。');
        page.getCountTR().then((value : any) => {
            expect(value.length).toBe(0);
        })

        browser.takeScreenshot().then(function (png) {
            cmnFuncs.writeScreenShot(png, pathOfImage + '\\image17.png');
        });
    })
})
