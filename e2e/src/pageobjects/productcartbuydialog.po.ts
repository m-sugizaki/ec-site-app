import { browser, by, element } from 'protractor';

export class ProductCartBuyDialogPage {

    navigateTo() {
        return browser.get(browser.baseUrl) as Promise<any>;
    }

    getOutputProductId(){
        return element(by.name('product_id')).getAttribute('value');
    }

    geOutputProductName(){
        return element(by.name('product_name')).getAttribute('value');
    }

    getOutputPrice(){
        return element(by.xpath('//*/app-product-cart-buy-dialog/div/div/form/div[3]/mat-form-field/div/div[1]/div/input')).getAttribute('value');
    }

    getOuputQuantity(){
        return element(by.xpath('//*/app-product-cart-buy-dialog/div/div/form/div[4]/mat-form-field/div/div[1]/div/input')).getAttribute('value');
    }

    getOutputAddress(){
        return element(by.name('address')).getAttribute('value');
    }

    getSelectSize(){
        return element(by.xpath('//*/app-product-cart-buy-dialog/div/div/form/div[6]/mat-form-field/div/div[1]/div/mat-select'));
    }

    getSelectColor(){
        return element(by.xpath('//*/app-product-cart-buy-dialog/div/div/form/div[7]/mat-form-field/div/div[1]/div/mat-select'));
    }

    getSelectPayment(){
        return element(by.xpath('//*/app-product-cart-buy-dialog/div/div/form/div[8]/mat-radio-group/mat-form-field/div/div[1]/div/mat-select'));
    }

    getSelectShipping(){
        return element(by.xpath('//*/app-product-cart-buy-dialog/div/div/form/div[10]/mat-radio-group/mat-form-field[2]/div/div[1]/div/mat-select'));
    }

    getOpionSelect(number){
        return element(by.xpath('//*/mat-option[' + number + ']'));
    }

    getCountOption(){
        return element.all(by.xpath('//*/mat-option'));
    }

    getFormatPrice(number : String){
        while(number.search(',') != -1 ){
            number = number.replace(',','');
        }
        return number
    }

    getSpanPaymentmethod(){
        return element(by.xpath('//*/app-product-cart-buy-dialog/div/div/form/div[8]/mat-radio-group/mat-form-field/div/div[1]/div/mat-select/div/div[1]/span/span')).getText();
    }

    getSpanShipping(){
        return element(by.xpath('//*/app-product-cart-buy-dialog/div/div/form/div[10]/mat-radio-group/mat-form-field[2]/div/div[1]/div/mat-select/div/div[1]/span/span')).getText();
    }

    getButtonAcceptCheckOut(){
        return element(by.xpath('//*/app-product-cart-buy-dialog/div/div/form/div[12]/button[1]'));
    }

    getButtonCancel(){
        return element(by.xpath('//*/app-product-cart-buy-dialog/div/div/form/div[12]/button[2]'));
    }

    getInputQuantity(){
        return element(by.xpath('//*/app-product-cart-buy-dialog/div/div/form/div[4]/mat-form-field/div/div[1]/div/input'));
    }

    getMessage(){
        return element(by.xpath('//*/app-product-cart-buy-dialog/div/div/form/div[12]/p')).getText();
    }

    getSpanSize(){
        return element(by.xpath('//*/app-product-cart-buy-dialog/div/div/form/div[6]/mat-form-field/div/div[1]/div/mat-select/div/div[1]/span/span')).getText();
    }

    getSpanColor(){
        return element(by.xpath('//*/app-product-cart-buy-dialog/div/div/form/div[7]/mat-form-field/div/div[1]/div/mat-select/div/div[1]/span/span')).getText();
    }

    getRadioCOD(){
        return element(by.xpath('//*/app-product-cart-buy-dialog/div/div/form/div[8]/mat-radio-group/mat-radio-button[2]'));
    }

    getRadioCredit(){
        return element(by.xpath('//*/app-product-cart-buy-dialog/div/div/form/div[8]/mat-radio-group/mat-radio-button[3]'));
    }

    getRadioShippingOther(){
        return element(by.xpath('//*[@name="radioShipping"]/mat-radio-button[2]'));
    }

    getButtonLogin(){
        return  element(by.xpath('//html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/mat-toolbar/mat-toolbar-row/div/div[3]/div[3]/button[1]'));
    }

    getButtonMenuPurchase(){
        return element(by.xpath('//html/body/app-root/app-home/mat-sidenav-container/mat-sidenav/div/mat-nav-list/a[4]'));
    }

    getButtonOpenCheckoutOfPurchase(){
        return element(by.xpath('//*[@id="table-review"]/tbody/tr/td[11]/button'));
    }

    getRadioBankTransfer(){
        return element(by.xpath('//*/app-product-cart-buy-dialog/div/div/form/div[8]/mat-radio-group/mat-radio-button[1]'));
    }

    getRadioAddressUser(){
        return element(by.xpath('//*/app-product-cart-buy-dialog/div/div/form/div[10]/mat-radio-group/mat-radio-button[1]'));
    }

    getButtonSignupPaymentDialog(){
        return element(by.xpath('//*/app-product-cart-buy-dialog/div/div/form/div[9]/button[1]'));
    }

    getButtonUpdatePaymentDialog(){
        return element(by.xpath('//*/app-product-cart-buy-dialog/div/div/form/div[9]/button[2]'))
    }

    getButtonSignupShippingAddressDialog(){
        return element(by.xpath('//*/app-product-cart-buy-dialog/div/div/form/div[11]/button[1]'));
    }

    getButtonUpdateShippingAddressDialog(){
        return element(by.xpath('//*/app-product-cart-buy-dialog/div/div/form/div[11]/button[2]'));
    }
    getCurrentShippingAddress() {
      return element(by.xpath(`//app-product-cart-buy-dialog/div/div/form/div[10]/mat-radio-group/mat-form-field[1]/div/div[1]/div/*[@id="address"]`)).getAttribute('value');
    }
    getDataFromSelectBox(text) {
      return element(by.xpath(`//mat-option[@id="`+text +`"]/span[@class="mat-option-text"]`));
    }
}
