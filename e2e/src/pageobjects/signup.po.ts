import { browser, by, element } from 'protractor';

export class SignUpPage {
  navigateTo() {
    return browser.get(browser.baseUrl + '/#/home') as Promise<any>;
  }
  getTitle() {
    return element(by.xpath(`//app-sigup-dialog/div/div/div/h1`)).getText();
  }
  getButtonOpenDialogLogin() {
    return element(by.xpath(`//html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/mat-toolbar/mat-toolbar-row/div/div[3]/div[3]/button[1]`));
  }
  getSignUpButtonFromHome() {
    return element(by.xpath(`//html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/mat-toolbar/mat-toolbar-row/div/div[3]/div[3]/button[2]`))
  }
  getSignUpBUttonFromLogin() {
    return element(by.xpath(`//login-dialog/div/div/button[1]`))
  }
  getUsername() {
    return element(by.xpath(`//app-sigup-dialog/div/div/div/form/input[@name="user_id"]`))
  }
  getPassword() {
    return element(by.xpath(`//app-sigup-dialog/div/div/div/form/*[@id="password"]`));
  }
  getPasswordConfirm() {
    return element(by.xpath(`//app-sigup-dialog/div/div/div/form/*[@id="confirmPassword"]`));
  }
  getButtonSubmit() {
    return element(by.xpath(`//button[@type="submit"]`));
  }

  getMessageError() {
    return element(by.xpath(`//app-sigup-dialog/div/div/div/form/p`)).getText();
  }
}
