import { browser, by, element } from 'protractor';

export class UserInfoUpdateDialogPage {

    navigateTo() {
        return browser.get(browser.baseUrl) as Promise<any>;
    }

    getButtonMenuUserInfo(){
        return element(by.xpath('//html/body/app-root/app-home/mat-sidenav-container/mat-sidenav/div/mat-nav-list/a[5]'));
    }

    getButtonOpenDialogUpdateUserInfo(){
        return element(by.xpath('//html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div[1]/app-userinfo/div/button'));
    }

    getTitleDialogUpdateUserInfo(){
        return element(by.xpath('//*/mat-dialog-container/app-user-info-update-dialog/div/h1')).getText();
    }

    getUserId(){
        return element(by.name('user_id'));
    }

    getName(){
        return element(by.name('name'));
    }

    getNickname(){
        return element(by.name('nickname'));
    }

    getPostalCode(){
        return element(by.name('postal_code'));
    }

    getAddress1(){
        return element(by.name('address1'));
    }

    getAddress2(){
        return element(by.name('address2'));
    }

    getPhoneNumber(){
        return element(by.name('phone_number'));
    }

    getEmail(){
        return element(by.name('email'));
    }

    getBirthday(){
        return element(by.name('user.birthday'));
    }

    getMemberRank(){
        return element(by.name('member_rank'));
    }

    getCountTrTablePayment(){
        return element.all(by.xpath('//*/mat-dialog-container/app-user-info-update-dialog/div/form/table[1]/tbody/tr'));
    }

    getCountTrTableShipping(){
        return element.all(by.xpath('//*/mat-dialog-container/app-user-info-update-dialog/div/form/table[2]/tbody/tr'));
    }

    getDataTdPayment(numbertr,numbertd){
        return element(by.xpath('//*/mat-dialog-container/app-user-info-update-dialog/div/form/table[1]/tbody/tr[' + numbertr +']/td[' + numbertd +']')).getText();
    }

    getDataTdshipping(numbertr,numbertd){
        return element(by.xpath('//*/mat-dialog-container/app-user-info-update-dialog/div/form/table[2]/tbody/tr[' + numbertr +']/td[' + numbertd +']')).getText();
    }

    getButtonOpenDialogPayment(){
        return element(by.xpath('//*/app-user-info-update-dialog/div/form/div[11]/button'));
    }

    getButtonCancleDialogPayment(){
        return element(by.xpath('//*/app-signup-paymentmethod-dialog/div/div/div/form/div[7]/button[2]'));
    }

    getButtonOpenDialogPaymentUpdate(){
        return element(by.xpath('//*/app-user-info-update-dialog/div/form/table[1]/tbody/tr/td[7]/button'));
    }

    getButtonCancleDialogPaymentUpdate(){
        return element(by.xpath('//*/app-update-paymentmethod-dialog/div/div/div/form/div[7]/button[2]'));
    }

    getButtonOpenDialogDeletePayment(){
        return element(by.xpath('//*/app-user-info-update-dialog/div/form/table[1]/tbody/tr/td[6]/button'));
    }

    getButtonCancleDialogDeletePayment(){
        return element(by.xpath('//*/app-confirm-dialog/div/div/button[2]'));
    }

    getButtonOpenDialogShipping(){
        return element(by.xpath('//*/app-user-info-update-dialog/div/form/div[12]/button'));
    }

    getButtonCancleDialogShipping(){
        return element(by.xpath('//*/app-shipping-address-dialog/div/div/div/form/div[8]/button[2]'))
    }

    getButtonOpenDialogUpdateShipping(){
        return element(by.xpath('//*/app-user-info-update-dialog/div/form/table[2]/tbody/tr/td[8]/button'));
    }

    getButtonCancleDialogUpdateShipping(){
        return element(by.xpath('//*/app-shipping-address-update-dialog/div/div/div/form/div[8]/button[2]'))
    }

    getButtonOpenDialogDeleteShipping(){
        return element(by.xpath('//*/app-user-info-update-dialog/div/form/table[2]/tbody/tr/td[7]/button'));
    }

    getButtonCancleDialogDeleteShipping(){
        return element(by.xpath('//*/app-confirm-dialog/div/div/button[2]'));
    }

    getTitleDialogPayment(){
        return element(by.xpath('//*/app-signup-paymentmethod-dialog/div/div/div/h1')).getText();
    }

    getTitleDialogPaymentUpdate(){
        return element(by.xpath('//*/app-update-paymentmethod-dialog/div/div/div/h1')).getText();
    }

    getTitleDialogShipping(){
        return element(by.xpath('//*/app-shipping-address-dialog/div/div/div/h1')).getText();
    }

    getTitleDialogShippingUpdate(){
        return element(by.xpath('//*/app-shipping-address-update-dialog/div/div/div/h1')).getText();
    }

    getButtonSubmit(){
        return element(by.xpath('//*/app-user-info-update-dialog/div/form/button[1]'))
    }
    
    getMessageError(){
        return element(by.xpath('//*/app-user-info-update-dialog/div/form/p')).getText();
    }

}