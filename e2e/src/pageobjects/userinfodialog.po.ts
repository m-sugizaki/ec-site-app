import { browser, by, element } from 'protractor';

export class UserInfoDialogPage {
  navigateTo() {
    return browser.get(browser.baseUrl + '/#/home') as Promise<any>;
  }
  getUserId() {
    return element(by.xpath(`//input[@name="user_id"]`)).getAttribute('value');
  }
  getName() {
    return element(by.xpath(`//input[@id="name"]`))
  }
  getNickname() {
    return element(by.xpath(`//input[@id="nickname"]`))
  }
  getPostalCode() {
    return element(by.xpath(`//input[@id="postal_code"]`))
  }
  getAddress1() {
    return element(by.xpath(`//input[@id="address1"]`))
  }
  getAddress2() {
    return element(by.xpath(`//input[@id="address2"]`))
  }
  getPhoneNumber() {
    return element(by.xpath(`//input[@id="phone_number"]`))
  }
  getEmail() {
    return element(by.xpath(`//input[@id="email"]`))
  }
  getBirthday() {
    return element(by.xpath(`//input[@id="birthday"]`))
  }
  getMemberRank() {
    return element(by.xpath(`//input[@id="member_rank"]`)).getText();
  }
  getButtonSubmit() {
    return element(by.xpath(`//app-userinfo-dialog/div/div/div/form/div[11]/button[1]`))
  }
  getButtonCancel() {
    return element(by.xpath(`//app-userinfo-dialog/div/div/div/form/div[11]/button[2]`))
  }
  getLinkRegistryPaymentMethod() {
    return element(by.xpath(`//app-userinfo-dialog/div/div/div/form/button[1]`));
  }
  getLinkRegistryShippingAddress() {
    return element(by.xpath(`//app-userinfo-dialog/div/div/div/form/button[2]`));
  }
  getMessage() {
    return element(by.xpath(`//app-userinfo-dialog/div/div/div/form/p`)).getText();
  }
}
