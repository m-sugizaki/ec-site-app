import { browser, by, element } from 'protractor';

export class PaymentMethodPage {

    navigateTo() {
        return browser.get(browser.baseUrl) as Promise<any>;
    }

    getButtonSubmitAddPayment(){
        return element(by.xpath('//*/app-signup-paymentmethod-dialog/div/div/div/form/div[7]/button[1]'));
    }

    getButtonCancleAddPayment(){
        return element(by.xpath('//*/app-signup-paymentmethod-dialog/div/div/div/form/div[7]/button[2]'))
    }

    getPaymentMethod(){
        return element(by.name('payment_method'));
    }

    getPaymentMethodUpdate(){
        return element(by.name('paymentMethod'));
    }

    getCardNumber(){
        return element(by.name('card_number'));
    }

    getCardNumberUpdate(){
        return element(by.name('cardNumber'));
    }

    getOwnerName(){
        return element(by.name('owner_name'));
    }

    getHolderName(){
        return element(by.name('cardHolderName'));
    }

    getMessageError(){
        return element(by.xpath('//*/app-signup-paymentmethod-dialog/div/div/div/form/p')).getText();
    }

    getUserId(){
        return element(by.name('userId'));
    }

    getPaymentNo(){
        return element(by.name('paymentNo'));
    }

    getMonth(){
        return element(by.xpath('//*/app-update-paymentmethod-dialog/div/div/div/form/div[5]/mat-form-field[1]/div/div[1]/div/mat-select/div/div[1]/span/span')).getText();
    }

    getYear(){
        return element(by.xpath('//*/app-update-paymentmethod-dialog/div/div/div/form/div[5]/mat-form-field[2]/div/div[1]/div/mat-select/div/div[1]/span/span')).getText();
    }

    getButtonSubmitUpdatePayMent(){
        return element(by.xpath('//*/app-update-paymentmethod-dialog/div/div/div/form/div[7]/button[1]'));
    }

    getSelectMonth(){
        return element(by.xpath('//*/app-update-paymentmethod-dialog/div/div/div/form/div[5]/mat-form-field[1]/div/div[1]/div/mat-select'));
    }

    getSelectYear(){
        return element(by.xpath('//*/app-update-paymentmethod-dialog/div/div/div/form/div[5]/mat-form-field[2]/div/div[1]/div/mat-select'));
    }

    getOpionSelect(number){
        return element(by.xpath('//*/mat-option[' + number + ']'));
    }

    getButtonSubmitDeletePayment(){
        return element(by.xpath('//*/app-confirm-dialog/div/div/button[1]'));
    }

    getSelectMonthAdd(){
        return element(by.xpath('//*/app-signup-paymentmethod-dialog/div/div/div/form/div[5]/mat-form-field[1]/div/div[1]/div/mat-select'));
    }

    getSelectYearAdd(){
        return element(by.xpath('//*/app-signup-paymentmethod-dialog/div/div/div/form/div[5]/mat-form-field[2]/div/div[1]/div/mat-select'));
    }

    getMonthAdd(){
        return element(by.xpath('//*/app-signup-paymentmethod-dialog/div/div/div/form/div[5]/mat-form-field[1]/div/div[1]/div/mat-select/div/div[1]/span/span')).getText();
    }

    getYearAdd(){
        return element(by.xpath('//*/app-signup-paymentmethod-dialog/div/div/div/form/div[5]/mat-form-field[2]/div/div[1]/div/mat-select/div/div[1]/span/span')).getText();
    }

    getButtonLogout(){
        return element(by.xpath('//html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/mat-toolbar/mat-toolbar-row/div/div[3]/div[3]/button'))
    }
    getButtonCancel() {
      return element(by.xpath(`//app-signup-paymentmethod-dialog/div/div/div/form/div[7]/button[2]`));
    }
    getTitle() {
      return element(by.xpath(`//app-signup-paymentmethod-dialog/div/div/div/h1`)).getText();
    }
}
