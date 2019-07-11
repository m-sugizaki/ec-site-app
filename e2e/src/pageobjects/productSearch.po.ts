import { browser, by, element } from 'protractor';

export class ProductSearchPage {

    navigateTo() {
        return browser.get(browser.baseUrl + '/#/search') as Promise<any>;
    }
    
    getTitleText(){
        return element(by.xpath('//html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div[1]/app-search-product/div/div/div/h1')).getText() as Promise<string>;
    }

    getUrl(){
        return browser.getCurrentUrl() as Promise<string>;
    }
    
    getButtonSearch(){
        return element(by.xpath('/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div[1]/app-search-product/div/div/div/form/div[3]/div[2]/div/button'));
    }

    getDataTD(numbertr,numbertd){
        return element(by.xpath('//*[@id="payment_method"]/tbody/tr['+numbertr+']/td['+numbertd+']')).getText();
    }

    getInputProductName(){
        return element(by.name('name'));
    }

    getInputMaker(){
        return element(by.name('maker'));
    }

    getInputFromPrice(){
        return element(by.name('fromprice'));
    }

    getInputToPrice(){
        return element(by.name('toprice'));
    }

    getMessage(){
        return element(by.xpath('//html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div[1]/app-search-product/div/div/div/p')).getText();
    }

    getFormatPrice(number : String){
        while(number.search(',') != -1 ){
            number = number.replace(',','');
        }
        return number
    }

    getButtonDetail(){
        return element(by.xpath('//*[@id="payment_method"]/tbody/tr[1]/td[1]/button'));
    }

    getErrorMessage(){
        return element(by.xpath('//html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div[1]/app-search-product/div/div/div/form/div[3]/div[2]/p')).getText();
    }

    getCountTR(){
        return element.all(by.xpath('//*[@id="payment_method"]/tbody/tr'));
    }
}