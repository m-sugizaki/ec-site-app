import { browser, by, element } from 'protractor';

export class ChangePassWordPage {

    navigateTo() {
        return browser.get(browser.baseUrl) as Promise<any>;
    }

    getUserId(){
        return element(by.xpath('//*/app-change-dialog/div/div/div/form/input[1]'));
    }

    getPassWord(){
        return element(by.id('currentPassword'));
    }
    
    getPasswordNew(){
        return element(by.id('newPassword'));
    }

    getPasswordConfirm(){
        return element(by.id('confirmPassword'));
    }

    getButtonSubmit(){
        return element(by.xpath('//*/app-change-dialog/div/div/div/form/div/button[1]'));
    }

    getButtonChangePassWord(){
        return element(by.xpath('//*/login-dialog/div/div/button[2]'));
    }

    getTitle(){
        return element(by.xpath('//*/login-dialog/div/div/div/h1'))
    }

    getMessageError(){
        return element(by.xpath('//*/app-change-dialog/div/div/div/form/p')).getText();
    }
}