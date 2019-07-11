import { browser, by, element } from 'protractor';

export class ShippingAddressDialogPage {

  getTitleFromDialogRegister() {
    return element(by.xpath(`//app-shipping-address-dialog/div/div/div/h1`)).getText();
  }
  getUserIdFromDialog() {
    return element(by.xpath(`//app-shipping-address-dialog/div/div/div/form/div[1]/mat-form-field/div/div[1]/div/*[@name="user_id"]`)).getAttribute('value');
  }
  getShippingAddressNoFromDialog() {
    return element(by.xpath(`//app-shipping-address-dialog/div/div/div/form/div[2]/mat-form-field/div/div[1]/div/*[@id="shipping_address_no"]`)).getAttribute('value');
  }
  getPostalCodeFromDialog() {
    return element(by.xpath(`//app-shipping-address-dialog/div/div/div/form/div[3]/mat-form-field/div/div[1]/div/*[@id="postal_code"]`));
  }
  getAddress1FromDialog() {
    return element(by.xpath(`//app-shipping-address-dialog/div/div/div/form/div[4]/mat-form-field/div/div[1]/div/*[@id="address1"]`));
  }
  getAddress2FromDialog() {
    return element(by.xpath(`//app-shipping-address-dialog/div/div/div/form/div[5]/mat-form-field/div/div[1]/div/*[@id="address2"]`));
  }
  getPhoneNumberFromDialog() {
    return element(by.xpath(`//app-shipping-address-dialog/div/div/div/form/div[6]/mat-form-field/div/div[1]/div/*[@id="phone_number"]`));
  }
  getShippingAddressNameFromDialog() {
    return element(by.xpath(`//app-shipping-address-dialog/div/div/div/form/div[7]/mat-form-field/div/div[1]/div/*[@id="shipping_address_name"]`));
  }
  getSubmitButtonFromDialog() {
    return element(by.xpath(`//app-shipping-address-dialog/div/div/div/form/div[8]/button[1]`));
  }
  getMessage() {
    return element(by.xpath(`//app-shipping-address-dialog/div/div/div/form/div[8]/p`)).getText();
  }
  getConfirmButtonFromConfirmDialog() {
    return element(by.xpath(`//app-confirm-dialog/div/div/button[1]`))
  }
  getDataTD(numbertr, numbertd){
    return element(by.xpath('//*[@id="shipping_method"]/tbody/tr[' + numbertr + ']/td[' + numbertd + ']')).getText();
  }
  getButtonFromShippingTd(numbertr, numbertd){
    return element(by.xpath('//*[@id="shipping_method"]/tbody/tr[' + numbertr + ']/td[' + numbertd + ']/button'));
  }
  getTitleFromDialogUpdate() {
    return element(by.xpath(`//app-shipping-address-update-dialog/div/div/div/h1`));
  }
  //
  getUserIdFromDialogUpdate() {
    return element(by.xpath(`//app-shipping-address-update-dialog/div/div/div/form/div[1]/mat-form-field/div/div[1]/div/*[@name="user_id"]`)).getAttribute('value');
  }
  getShippingAddressNoFromDialogUpdate() {
    return element(by.xpath(`//app-shipping-address-update-dialog/div/div/div/form/div[2]/mat-form-field/div/div[1]/div/*[@id="shipping_address_no"]`)).getAttribute('value');
  }
  getPostalCodeFromDialogUpdate() {
    return element(by.xpath(`//app-shipping-address-update-dialog/div/div/div/form/div[3]/mat-form-field/div/div[1]/div/*[@id="postal_code"]`));
  }
  getAddress1FromDialogUpdate() {
    return element(by.xpath(`//app-shipping-address-update-dialog/div/div/div/form/div[4]/mat-form-field/div/div[1]/div/*[@id="address1"]`));
  }
  getAddress2FromDialogUpdate() {
    return element(by.xpath(`//app-shipping-address-update-dialog/div/div/div/form/div[5]/mat-form-field/div/div[1]/div/*[@id="address2"]`));
  }
  getPhoneNumberFromDialogUpdate() {
    return element(by.xpath(`//app-shipping-address-update-dialog/div/div/div/form/div[6]/mat-form-field/div/div[1]/div/*[@id="phone_number"]`));
  }
  getShippingAddressNameFromDialogUpdate() {
    return element(by.xpath(`//app-shipping-address-update-dialog/div/div/div/form/div[7]/mat-form-field/div/div[1]/div/*[@id="shipping_address_name"]`));
  }
  getSubmitButtonFromDialogUpdate() {
    return element(by.xpath(`//app-shipping-address-update-dialog/div/div/div/form/div[8]/button[1]`));
  }
  getMessageFromDialogUpdate() {
    return element(by.xpath(`//app-shipping-address-update-dialog/div/div/div/form/div[8]/p`)).getText();
  }
  getButtonSubmitFromUserInfoUpdate() {
    return element(by.xpath(`//app-user-info-update-dialog/div/form/button[1]`))
  }
  getButtonCancel() {
    return element(by.xpath(`//app-shipping-address-dialog/div/div/div/form/div[8]/button[2]`))
  }
}
