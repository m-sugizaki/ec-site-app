import { browser, by, element } from 'protractor';

export class ProductDetailPage {

    navigateTo() {
        return browser.get(browser.baseUrl) as Promise<any>;
    }

    getButtonMenuSearch(){
        return element(by.xpath('/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav/div/mat-nav-list/a[2]'));
    }

    getOutputProductId(){
        return element(by.name('productId')).getAttribute('value');
    }

    getOutputProductName(){
        return element(by.name('productName')).getAttribute('value');
    }

    getOutputMaker(){
        return element(by.name('maker')).getAttribute('value');
    }

    getOutputPrice(){
        return element(by.name('price')).getAttribute('value');
    }

    getOutputSalePoint(){
        return element(by.name('salePoint')).getAttribute('value');
    }

    getOutputStockQuantity(){
        return element(by.name('stockQuantity')).getAttribute('value');
    }

    getImage(){
        return element(by.id('ItemPreview')).getAttribute('src');
    }

    getTDData(numbertr,numbertd){
        return element(by.xpath('//*[@id="table-review"]/tbody/tr['+numbertr+']/td['+numbertd+']')).getText();
    }

    getCountTr(){
        return element.all(by.xpath('//*[@id="table-review"]/tbody/tr'));
    }

    getEvaluation(number){
        switch(number)
        {
            case 1:
                return '★☆☆☆☆';
            case 2:
                return '★★☆☆☆';
            case 3:
                return '★★★☆☆';
            case 4:
                return '★★★★☆';
            case 5:
                return '★★★★★';
        }
    }

    getSimilarProduct(){
        return element.all(by.xpath('/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div[1]/app-product-detail/div[1]/div/div/div[10]/div/a'));
    }

    getButtonAddToCart(){
        return element(by.xpath('/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div[1]/app-product-detail/div[1]/div/div/div[13]/button[1]'));
    }

    getButtonGoToCheckOut(){
        return element(by.xpath('/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div[1]/app-product-detail/div[1]/div/div/div[13]/button[2]'));
    }

    getButtonLogin(){
        return element(by.xpath('//*/mat-dialog-container/login-dialog/div/div/div/form/div/button[1]'));
    }

    getButtonLogout(){
        return element(by.xpath('/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/mat-toolbar/mat-toolbar-row/div/div[3]/div[3]/button'));
    }

    getLastTr(number){
        return element(by.xpath('//*[@id="table-review"]/tbody/tr['+number+']'))
    }

    getSpanWellcome(){
        return element(by.xpath('/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/mat-toolbar/mat-toolbar-row/div/div[3]/div[2]/span')).getText();
    }

    getSelectOptionSize(){
        return element(by.xpath('//*[@id="mat-select-0"]'));
    }

    getOptionSize(){
        return element.all(by.xpath('//*[@id="cdk-overlay-0"]/div/div/mat-option/span')).getText();
    }

    getSelectOptionColor(){
        return element(by.xpath('//*[@id="mat-select-1"]'))
    }

    getOptionColor(){
        return element.all(by.xpath('//*[@id="cdk-overlay-1"]/div/div/mat-option/span')).getText();
    }

    getPurchasePrice(){
        return element(by.xpath('//*[@id="purchasePrice"]'));
    }

    getFormatPrice(number : String){
        while(number.search(',') != -1 ){
            number = number.replace(',','');
        }
        return number
    }

    getTextOptionSize(){
        return element(by.xpath('//html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div[1]/app-product-detail/div[1]/div/div/div[5]/mat-form-field/div/div[1]/div/mat-select/div/div[1]/span/span')).getText();
    }

    getTextOptionColor(){
        return element(by.xpath('//html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div[1]/app-product-detail/div[1]/div/div/div[6]/mat-form-field/div/div[1]/div/mat-select/div/div[1]/span/span')).getText();
    }

    getLinksimilarProduct(){
        return element(by.xpath('//html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div[1]/app-product-detail/div[1]/div/div/div[10]/div/a[1]'));
    }

    getTitleLoginDialog(){
        return element(by.xpath('//*//mat-dialog-container/login-dialog/div/div/div/h1')).getText();
    }

    getTitleCheckoutDialog(){
        return element(by.xpath('//*//mat-dialog-container/app-product-cart-buy-dialog/div/div/h1')).getText();
    }

    getInputQuantity(){
        return element(by.name('quantity'));
    }

    getMessage(){
        return element(by.xpath('//html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div[1]/app-product-detail/div[1]/div/div/p')).getText();
    }

    getQuantity(){
        return element(by.name('quantity')).getAttribute('value');
    }

}
