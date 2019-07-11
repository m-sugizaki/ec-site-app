import { browser, by, element } from 'protractor';

export class PurchaseHistoryPage {
  navigateTo() {
    return browser.get('/#/purchase-history') as Promise<any>;
  }
  getLinkToPurchaseHistory() {
    return element(by.xpath(`/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav/div/mat-nav-list/a[4]/div`));
  }
  getDataTD(numberTr,numberTd){
    return element(by.xpath(`//table[@id='table-review']/tbody/tr[`+numberTr+`]/td[`+numberTd+`]`)).getText();
  }
  getDataTDObjectCol(numberTr,numberTd){
    return element(by.xpath(`//table[@id='table-review']/tbody/tr[`+numberTr+`]/td[`+numberTd+`]`));
  }
  getButtonPurchaseFromCheckOut() {
    return element(by.xpath(`//app-product-cart-buy-dialog/div/div/form/div[12]/button[1]`))
  }
  getCancelOrderButton() {
    return element(by.xpath(`//*[@id="table-review"]/tbody/tr[1]/td[12]/button`))
  }
  getAddToCartButton() {
    return element(by.xpath(`//*[@id="table-review"]/tbody/tr[1]/td[10]/button`));
  }
  getGoToCheckOutButton() {
    return element(by.xpath(`//*[@id="table-review"]/tbody/tr[1]/td[11]/button`));
  }
  getCancelOrderButtonFromDialog() {
    return element(by.xpath(`//app-cancel-order-dialog/div/div/div/div[9]/button[1]`))
  }
  getConfirmActionButton() {
    return element(by.xpath(`//app-confirm-dialog/div/div/button[1]`))
  }
  getTitleFromCheckOut() {
    return element(by.xpath(`//app-product-cart-buy-dialog/div/div/h1`)).getText();
  }
}
