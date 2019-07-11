import { browser, by, element } from 'protractor';

export class MyPage {
  navigateTo() {
    return browser.get(browser.baseUrl) as Promise<any>;
  }

  getMainTitleText() {
    return element(by.xpath(`//html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/mat-toolbar/mat-toolbar-row/div/div[2]/span`)).getText();
  }
  getHomeTitle() {
    return element(by.xpath(`//html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div[1]/app-mypage/p`)).getText();
  }
  getLinkToHome() {
    return element(by.xpath(`//html/body/app-root/app-home/mat-sidenav-container/mat-sidenav/div/mat-nav-list/a[1]`));
  }
  getLinkToProductSearch() {
    return element(by.xpath(`//html/body/app-root/app-home/mat-sidenav-container/mat-sidenav/div/mat-nav-list/a[2]`));
  }
  getGreetingMessage() {
    return element(by.xpath(`//html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/mat-toolbar/mat-toolbar-row/div/div[3]/div[2]/span`)).getText();
  }
  getButtonLogin() {
    return element(by.xpath(`//html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/mat-toolbar/mat-toolbar-row/div/div[3]/div[3]/button[1]`));
  }
  getButtonSignUp() {
    return element(by.xpath(`//html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/mat-toolbar/mat-toolbar-row/div/div[3]/div[3]/button[2]`));
  }
  getTextFromLinkHome() {
    return element(by.xpath(`/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav/div/mat-nav-list/a[1]/div/span`)).getText();
  }
  getTextFromLinkProductSearch() {
    return element(by.xpath(`/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav/div/mat-nav-list/a[2]/div/span`)).getText();
  }
}
