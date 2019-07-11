import { browser, by, element } from 'protractor';

export class ReviewDialogPage {

  getLinkToPurchaseHistory() {
    return element(by.xpath(`//html/body/app-root/app-home/mat-sidenav-container/mat-sidenav/div/mat-nav-list/a[4]`));
  }

  getTitle() {
    return element(by.xpath(`//app-review-info-dialog/h1`)).getText();
  }

  getProductId() {
    return element(by.xpath('//input[@id="product_id"]')).getAttribute('value');
  }

  getDataTD(numberTr, numberTd) {
    return element(by.xpath(`//body/div/div[2]/div/mat-dialog-container/app-review-info-dialog/div[2]/table/tbody/tr[` + numberTr + `]/td[` + numberTd + `]`)).getText();
  }

  getDataTDObjectCol(numberTr, numberTd) {
    return element(by.xpath(`//body/div/div[2]/div/mat-dialog-container/app-review-info-dialog/div[2]/table/tbody/tr[` + numberTr + `]/td[` + numberTd + `]`));
  }

  getCountTR() {
    return element.all(by.xpath('//body/div/div[2]/div/mat-dialog-container/app-review-info-dialog/div[2]/table/tbody/tr'));
  }
  getButtonRegister() {
    return element(by.xpath(`//app-review-info-dialog/button`));
  }
  getTitleFromReviewRegister() {
    return element(by.xpath(`//app-registry-review-info-dialog/div/div/div/h1`)).getText();
  }
  getProductIdFromReviewRegister() {
    return element(by.xpath(`//app-registry-review-info-dialog/div/div/div/div[1]/mat-form-field[1]/div/div[1]/div/input[@name="product_id"]`)).getAttribute('value');
  }
  getProductNameFromReviewRegister() {
    return element(by.xpath(`//app-registry-review-info-dialog/div/div/div/div[1]/mat-form-field[2]/div/div[1]/div/input[@name="productName"]`)).getAttribute('value');
  }
  getNicknameFromReviewRegister() {
    return element(by.xpath(`//app-registry-review-info-dialog/div/div/div/div[2]/mat-form-field/div/div[1]/div/input[@name="nickname"]`)).getAttribute('value');
  }
  getSelectBox() {
    return element(by.xpath(`//app-registry-review-info-dialog/div/div/div/div[3]/mat-form-field/div/div[1]/div/mat-select`));
  }
  getSelectedItem(number) {
    return element(by.xpath(`//mat-option[@value="`+ number +`"]/span[@class="mat-option-text"]`));
  }
  reviewContent() {
    return element(by.xpath(`//app-registry-review-info-dialog/div/div/div/div[4]/mat-form-field/div/div[1]/div/textarea[@name="review_content"]`));
  }
  getButtonSubmitFromReviewRegister() {
    return element(by.xpath(`//app-registry-review-info-dialog/div/div/div/div[5]/button[1]`));
  }
  getConfirmButtonFromConfirmDialog() {
    return element(by.xpath(`//app-confirm-dialog/div/div/button[1]`));
  }
  getMessage() {
    return element(by.xpath(`//app-registry-review-info-dialog/div/div/div/p`)).getText();
  }
  getButtonCancel() {
    return element(by.xpath(`//app-registry-review-info-dialog/div/div/div/div[5]/button[2]`))
  }
}
