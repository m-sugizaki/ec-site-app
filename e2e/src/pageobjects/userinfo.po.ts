import { browser, by, element } from 'protractor';


export class UserInfoPage {

    navigateTo() {
        return browser.get(browser.baseUrl + '/#/home') as Promise<any>;
      }

    getButtonInfoMenu(){
      return element(by.xpath('/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav/div/mat-nav-list/a[5]'));
    }

    getlastTrPayment(number){
      return element(by.xpath('/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div[1]/app-userinfo/div/table[2]/tbody/tr[' + number + ']'))
    }

    getlastTrShiping(number){
      return element(by.xpath('/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div[1]/app-userinfo/div/table[3]/tbody/tr['+number+']'))
    }

    getUserId(){
      return element(by.xpath('//*[@id="userinfo"]/tbody/tr[1]/td[2]')).getText();
    }

    getName(){
      return element(by.xpath('//*[@id="userinfo"]/tbody/tr[2]/td[2]')).getText();
    }

    getNickName(){
      return element(by.xpath('//*[@id="userinfo"]/tbody/tr[3]/td[2]')).getText();
    }

    getPostalCode(){
      return element(by.xpath('//*[@id="userinfo"]/tbody/tr[4]/td[2]')).getText();
    }

    getAddress1(){
      return element(by.xpath('//*[@id="userinfo"]/tbody/tr[5]/td[2]')).getText();
    }

    getAddress2(){
      return element(by.xpath('//*[@id="userinfo"]/tbody/tr[6]/td[2]')).getText();
    }

    getPhoneNumber(){
      return element(by.xpath('//*[@id="userinfo"]/tbody/tr[7]/td[2]')).getText();
    }

    getEmail(){
      return element(by.xpath('//*[@id="userinfo"]/tbody/tr[8]/td[2]')).getText();
    }

    getBirthday(){
      return element(by.xpath('//*[@id="userinfo"]/tbody/tr[9]/td[2]')).getText();
    }

    getMemberRank(){
      return element(by.xpath('//*[@id="userinfo"]/tbody/tr[10]/td[2]')).getText();
    }

    getPaymentTd(numbertr, numbertd){
      return element(by.xpath('/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div[1]/app-userinfo/div/table[2]/tbody/tr[' + numbertr + ']/td['+ numbertd +']'));
    }

    getShippingTd(numbertr, numbertd){
      return element(by.xpath('/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div[1]/app-userinfo/div/table[3]/tbody/tr[' + numbertr + ']/td[' + numbertd + ']'));
    }

    getPaymentCountTr(){
      return element.all(by.xpath('/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div[1]/app-userinfo/div/table[2]/tbody/tr'));
    }

    getShippingCountTr(){
      return element.all(by.xpath('/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div[1]/app-userinfo/div/table[3]/tbody/tr'));
    }

    getInputUserId(){
      return element(by.name('user_id'));
    }

    getInputPassword(){
      return element(by.name('password'));
    }

    getButtonUpdateUserInfo(){
      return element(by.xpath('/html/body/app-root/app-home/mat-sidenav-container/mat-sidenav-content/div[1]/app-userinfo/div/button'))
    }
    getButtonRegisterShippingAddress() {
      return element(by.xpath(`//app-user-info-update-dialog/div/form/div[12]/button`))
    }


}
