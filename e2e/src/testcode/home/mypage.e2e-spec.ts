import { browser, logging, Key, protractor } from 'protractor';

import { CommonFuns } from '../../testutils/common.functions';
import { MyPage } from '../../pageobjects/mypage.po';
import { ProductSearchPage } from '../../pageobjects/productSearch.po';
import { LoginPage } from '../../pageobjects/login.po';
import { SignUpPage } from '../../pageobjects/signup.po';

describe('ECサイト Home Page', () => {
  let page: MyPage;
  let productSearchPage: ProductSearchPage;
  let loginPage: LoginPage;
  let signUpPage: SignUpPage;
  let commonFunction: CommonFuns;
  let pathOfImage: string;

  beforeAll(() => {
    browser.driver.manage().window().maximize();
    page = new MyPage();
    productSearchPage = new ProductSearchPage();
    loginPage = new LoginPage();
    signUpPage = new SignUpPage();
    commonFunction = new CommonFuns();

    pathOfImage = commonFunction.getRootEvidenceFolderName() + '\\home';
    commonFunction.initEvidenceFolder(pathOfImage);
  });

  it('Should display Home', () => {
    page.navigateTo();
    expect(page.getMainTitleText()).toEqual('アジャイル開発実践ECサイト');
    expect(page.getHomeTitle()).toEqual('新着情報');
    expect(page.getTextFromLinkHome()).toEqual('マイページ');
    expect(page.getTextFromLinkProductSearch()).toEqual('商品検索');
    expect(page.getGreetingMessage()).toEqual('ようこそゲストさま');
    expect(page.getButtonLogin().getText()).toEqual('ログイン');
    expect(page.getButtonSignUp().getText()).toEqual('新規登録');

    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image1.png');
    });
    page.getLinkToProductSearch().click();
    browser.waitForAngular();

    expect(productSearchPage.getTitleText()).toEqual('商品検索')
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image2.png');
    });

    page.getLinkToHome().click();
    browser.waitForAngular();

    expect(page.getHomeTitle()).toEqual('新着情報');
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image3.png');
    });

    page.getButtonLogin().click();
    browser.waitForAngular();

    expect(loginPage.getTitle()).toEqual('ログイン');
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image4.png');
    });

    loginPage.getButtonCancel().click();
    browser.waitForAngular();
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image5.png');
    });
    page.getButtonSignUp().click();
    browser.waitForAngular();

    expect(signUpPage.getTitle()).toEqual('新規パスワード登録');
    browser.takeScreenshot().then(function (png) {
      commonFunction.writeScreenShot(png, pathOfImage + '\\image6.png');
    });
  });
});
