import { browser, by, element } from 'protractor';
import { HttpClient } from "protractor-http-client"


export class LoginPage {

  constructor(
  ) { }
  navigateTo() {
    return browser.get(browser.baseUrl + '/#/home') as Promise<any>;
  }
  getTitle() {
    return element(by.xpath(`//login-dialog/div/div/div/h1`)).getText();
  }
  getUsername() {
    return element(by.xpath(`//input[@name="user_id"]`));
  }
  getPassword() {
    return element(by.xpath(`//input[@name='password']`));
  }
  getSubmitButton() {
    return element(by.className('btn-login'));
  }
  getForm() {
    return element(by.className('login-form'))
  }
  getButtonOpenLoginDialog() {
    return element(by.xpath("//html/body/app-root/app-home[@class='ng-star-inserted']/mat-sidenav-container[@class='nav-container mat-drawer-container mat-sidenav-container']/mat-sidenav-content[@class='nav-content mat-drawer-content mat-sidenav-content']/mat-toolbar[@class='header mat-toolbar mat-toolbar-multiple-rows changeState']/mat-toolbar-row[@class='row-1 mat-toolbar-row']/div/div[@class='icon-cover'][2]/div[@class='ng-star-inserted']/button[@class='mat-button'][1]/span[@class='mat-button-wrapper']"))
  }
  getButtonLogOut() {
    return element(by.xpath(`/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/mat-toolbar/mat-toolbar-row/div/div[3]/div[3]/button`))
  }
  getMessage() {
    return element(by.xpath(`//p[@_ngcontent-c10=""]`)).getText();
  }
  getButtonCancel() {
    return element(by.className('btn-cancel'))
  }
  getLoginDt() {
    return element(by.xpath(`//html/body/app-root/app-home[@class='ng-star-inserted']/mat-sidenav-container[@class='nav-container mat-drawer-container mat-sidenav-container']/mat-sidenav-content[@class='nav-content mat-drawer-content mat-sidenav-content']/mat-toolbar[@class='header mat-toolbar mat-toolbar-multiple-rows changeState']/mat-toolbar-row[@class='row-1 mat-toolbar-row']/div/div[@class='icon-cover'][2]/div[@class='userInfo']/span[@class='ng-star-inserted'][1]`)).getText();
  }
  getNickname() {
    return element(by.xpath(`//html/body/app-root/app-home[@class='ng-star-inserted']/mat-sidenav-container[@class='nav-container mat-drawer-container mat-sidenav-container']/mat-sidenav-content[@class='nav-content mat-drawer-content mat-sidenav-content']/mat-toolbar[@class='header mat-toolbar mat-toolbar-multiple-rows changeState']/mat-toolbar-row[@class='row-1 mat-toolbar-row']/div/div[@class='icon-cover'][2]/div[@class='userInfo']/span[1]`)).getText();
  }
  getTagHasProductCart() {
    return element(by.xpath(`//html/body/app-root/app-home[@class='ng-star-inserted']/mat-sidenav-container[@class='nav-container mat-drawer-container mat-sidenav-container']/mat-sidenav-content[@class='nav-content mat-drawer-content mat-sidenav-content']/mat-toolbar[@class='header mat-toolbar mat-toolbar-multiple-rows changeState']/mat-toolbar-row[@class='row-1 mat-toolbar-row']/div/div[@class='icon-cover'][2]/div[@class='userInfo']/span[@class='ng-star-inserted'][2]`));
  }
}
