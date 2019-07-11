import { AppPage } from '../pageobjects/app.po';
import { CommonFuns } from '../testutils/common.functions';
import { browser, logging } from 'protractor';

describe('ECサイト project App', () => {
  let page: AppPage;
  let cmnFuncs : CommonFuns;
  let pathOfImage : string;

  beforeAll(() => {
    browser.driver.manage().window().maximize();
    page = new AppPage();
    cmnFuncs = new CommonFuns();
  });

  it('should display title: ECサイト', () => {
    pathOfImage = cmnFuncs.getRootEvidenceFolderName() + '\\app';
    cmnFuncs.initEvidenceFolder(pathOfImage);

    page.navigateTo();
    expect(page.getTitleText()).toEqual('ECサイト');
    browser.takeScreenshot().then(function (png) {
      cmnFuncs.writeScreenShot(png, pathOfImage + '\\image1.png');
    });
  });
});
