import { browser, by, element } from 'protractor';

export class ProductCartPage {

    navigateTo() {
        return browser.get(browser.baseUrl) as Promise<any>;
    }

    getSpanProductCart(){
        return element(by.xpath('//html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/mat-toolbar/mat-toolbar-row/div/div[3]/div[2]/span[3]')).getText();
    }

    getCountTr(){
        return element.all(by.xpath('//html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div[1]/app-product-cart/div/div/table/tbody/tr'));
    }

    getDataTd(numbertr, numbertd){
        return element(by.xpath('//html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div[1]/app-product-cart/div/div/table/tbody/tr[' + numbertr + ']/td[' + numbertd +']')).getText();
    }

    getFormatPrice(number : String){
        while(number.search(',') != -1 ){
            number = number.replace(',','');
        }
        return number
    }

    getButtonProductCart(){
        return element(by.xpath('//html/body/app-root/app-home/mat-sidenav-container/mat-sidenav/div/mat-nav-list/a[3]'));
    }

    getButtonUpdateProductCart(){
        return element(by.xpath('//*[@id="payment_method"]/tbody/tr[1]/td[10]/button'));
    }

    getButtonDeleteProductCart(){
        return element(by.xpath('//*[@id="payment_method"]/tbody/tr[1]/td[11]/button'));
    }

    getButtonCheckoutProduct(){
        return element(by.xpath('//*[@id="payment_method"]/tbody/tr[1]/td[12]/button'))
    }

    getButronCancleUpdate(){
        return element(by.xpath('//*/mat-dialog-container/app-product-cart-update-dialog/div/div/div/form/div[8]/button[2]'));
    }

    getButtonCancleDelete(){
        return element(by.xpath('//*/mat-dialog-container/app-confirm-dialog/div/div/button[2]'))
    }

    getButtonCancleCheckout(){
        return element(by.xpath('//*/mat-dialog-container/app-product-cart-buy-dialog/div/div/form/div[12]/button[2]'))
    }

    getButtonAcceptDelete(){
        return element(by.xpath('//*/mat-dialog-container/app-confirm-dialog/div/div/button[1]'));
    }

    getButtonAcceptCheckOut(){
        return element(by.xpath('//*/mat-dialog-container/app-product-cart-buy-dialog/div/div/form/div[12]/button[1]'))
    }

    getButtonMenuSearch(){
        return element(by.xpath('//html/body/app-root/app-home/mat-sidenav-container/mat-sidenav/div/mat-nav-list/a[2]'));
    }

    getTitileCheckoutDialog(){
        return element(by.xpath('//*/mat-dialog-container/app-product-cart-buy-dialog/div/div/h1')).getText();
    }

    getTdProductCartId(){
        return element(by.xpath('//*[@id="payment_method"]/tbody/tr[1]/td[1]')).getText();
    }

    getOutputProductCartId(){
        return element(by.name('product_cart_id')).getAttribute('value');
    }

    getOuputProductId(){
        return element(by.name('product_id')).getAttribute('value');
    }

    getOuputProductName(){
        return element(by.name('product_name')).getAttribute('value');
    }

    getOutputPrice(){
        return element(by.name('price')).getAttribute('value');
    }

    getOuputQuantity(){
        return element(by.name('quantity')).getAttribute('value');
    }

    getInputQuantity(){
        return element(by.name('quantity'));
    }

    getOutputSize(){
        return element(by.xpath('//*/mat-dialog-container/app-product-cart-update-dialog/div/div/div/form/div[6]/mat-form-field/div/div[1]/div/mat-select/div/div[1]/span/span')).getText();
    }

    getOutputColor(){
        return element(by.xpath('//*/mat-dialog-container/app-product-cart-update-dialog/div/div/div/form/div[7]/mat-form-field/div/div[1]/div/mat-select/div/div[1]/span/span')).getText()
    }

    getTitleDialogUpdate(){
        return element(by.xpath('//*/mat-dialog-container/app-product-cart-update-dialog/div/div/div/h1')).getText();
    }

    getMessage(){
        return element(by.xpath('//*/mat-dialog-container/app-product-cart-update-dialog/div/div/div/form/div[8]/p')).getText();
    }

    getButtonAcceptUpdate(){
        return element(by.xpath('//*/mat-dialog-container/app-product-cart-update-dialog/div/div/div/form/div[8]/button[1]'));
    }

    getOpionSelect(number){
        return element(by.xpath('//*/mat-option[' + number + ']'));
    }

    getCountOption(){
        return element.all(by.xpath('//*/mat-option'));
    }

    getSelectSize(){
        return element(by.xpath('//*/mat-dialog-container/app-product-cart-update-dialog/div/div/div/form/div[6]/mat-form-field/div/div[1]/div/mat-select'));
    }

    getSelectColor(){
        return element(by.xpath('//*/mat-dialog-container/app-product-cart-update-dialog/div/div/div/form/div[7]/mat-form-field/div/div[1]/div/mat-select'))
    }
}