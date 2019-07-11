import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar, MatDialog } from '@angular/material'
import { UserService } from '../../../services/user.service';
import { Router } from '@angular/router';
import { PaymentService } from '../../../services/payment.service';
import { ShippingService } from '../../../services/shipping.service';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ShippingAddressDialogComponent } from '../../shipping-address-dialog/shipping-address-dialog.component';
import { SignupPaymentmethodDialogComponent } from '../../signup-paymentmethod-dialog/signup-paymentmethod-dialog.component';
import { UpdatePaymentmethodDialogComponent } from '../update-paymentmethod-dialog/update-paymentmethod-dialog.component';
import { ShippingAddressUpdateDialogComponent } from '../shipping-address-update-dialog/shipping-address-update-dialog.component';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { SharedService } from 'src/app/services/shared.service';




@Component({
  selector: 'app-user-info-update-dialog',
  templateUrl: './user-info-update-dialog.component.html',
  styleUrls: ['./user-info-update-dialog.component.scss'],
  providers: [DatePipe]
})
export class UserInfoUpdateDialogComponent implements OnInit {

  payments
  shippings
  message
  user: any = {
    user_id: '',
    name: '',
    nickname: '',
    postal_code: '',
    address1: '',
    address2: '',
    phone_number: '',
    email: '',
    birthday: '',
    member_rank: '',
    birthday_new: '',
  }
  constructor(
    private router: Router,
    public dialogRef: MatDialogRef<UserInfoUpdateDialogComponent>,
    private userService: UserService,
    private paymentService: PaymentService,
    private shippingService: ShippingService,
    private datePipe: DatePipe,
    private dialog: MatDialog,
    private sharedService: SharedService,
  ) { }

  ngOnInit() {
    this.userService.getUserInfo().subscribe(
      result => {
        this.user.user_id = result.primaryKey.userId;
        this.user.name = result.name;
        this.user.nickname = result.nickname;
        this.user.postal_code = result.postalCode;
        this.user.address1 = result.address1;
        this.user.address2 = result.address2;
        this.user.phone_number = result.phoneNumber;
        this.user.email = result.email;
        this.user.birthday_new = this.datePipe.transform(result.birthday, "yyyy/MM/dd");
        this.user.member_rank = result.memberRank;
        this.user.birthday = result.birthday;

        this.paymentService.getPaymentMethodByUserID(this.user.user_id).subscribe(
          result => {
            this.payments = result;
          }
        );
        this.shippingService.getShippingAddressByUserID(this.user.user_id).subscribe(
          result => {
            this.shippings = result;
          }
        )
      }
    );

  }
  onNoClick() {
    this.dialogRef.close(true);
  }
  updateUserInfo() {
    let phoneFormat = '[0-9]{2,5}-[0-9]{1,4}-[0-9]{4,4}'
    let postalCodeFormat = '[0-9]{3}-[0-9]{4}'
    let dateFormat = '^[0-9]{4}[\/]?(((([0]{0,1}[13578])|(1[02]))[\/]?(([0-2]{0,1}[0-9])|(3[01])))|((([0]{0,1}[469])|(11))[\/]?(([0-2]{0,1}[0-9])|(30)))|([0]{0,1}2[\/]?[0-2]{0,1}[0-9]))$'
    let isValid = true;
    let postalCode = new FormControl(this.user.postal_code, Validators.compose([Validators.pattern(postalCodeFormat)]))
    let phoneNumber = new FormControl(this.user.phone_number, Validators.compose([Validators.pattern(phoneFormat)]))
    let email = new FormControl(this.user.email, Validators.compose([Validators.email]))
    let birthday = new FormControl(this.user.birthday_new, Validators.compose([Validators.pattern(dateFormat)]))

    this.message = '';
    if (this.user.name === '' && isValid == true) {
      this.message = '氏名 を入力してください。';
      isValid = false;
      return
    }
    if (this.user.nickname === '' && isValid == true) {
      this.message = 'ﾆｯｸﾈｰﾑ を入力してください。';
      isValid = false;
      return
    }
    if (this.user.postal_code === '' && isValid == true) {
      this.message = '郵便番号 を入力してください。';
      isValid = false;
      return
    }
    if (this.user.address1 === '' && isValid == true) {
      this.message = '住所1 を入力してください。';
      isValid = false;
      return
    }
    if (this.user.phone_number === '' && isValid == true) {
      this.message = '電話番号 を入力してください。';
      isValid = false;
      return
    }
    if (this.user.email === '' && isValid == true) {
      this.message = 'E-mail を入力してください。';
      isValid = false;
      return
    }
    if (this.user.birthday_new === '' && isValid == true) {
      this.message = '生年月日 を入力してください。';
      isValid = false;
      return
    }
    if (this.user.member_rank === '' && isValid == true) {
      this.message = '会員ﾗﾝｸ を入力してください。';
      isValid = false;
      return
    }
    if (isValid === true && postalCode.status === "INVALID") {
      this.message = '郵便番号のフォーマットが正しくないです。\n';
      isValid = false;
    }
    if (isValid === true && phoneNumber.status === "INVALID") {
      this.message = '電話番号のフォーマットが正しくないです。\n';
      isValid = false;
    }
    if (isValid === true && email.status === "INVALID") {
      this.message = 'Emailのフォーマットが正しくないです。\n';
      isValid = false;
    }
    if (isValid === true && birthday.status === "INVALID") {
      this.message = '日付のフォーマットが正しくないです。\n';
      isValid = false;
    }
    let date = this.user.birthday_new.split('/');
    if((Number(date[1])==2&&Number(date[0])>28)&&isValid === true)
    {
      if(!(Number(date[0]) % 4 == 0 && Number(date[0]) % 100 != 0))
      {
        
        this.message = '日付のフォーマットが正しくないです。\n';
        isValid = false;
      }
      
     }
    if (isValid) {
    
      this.user.birthday = Date.parse(this.user.birthday_new);
      this.userService.updateUserInfo(this.user).subscribe(
        result => {

          this.dialogRef.close(result);
        }
      );
    }
    else {
      return
    }
  }

  openDialogPaymentMethod() {
    const dialogRef = this.dialog.open(SignupPaymentmethodDialogComponent, {
      width: '750px',
      height: '700px',
      disableClose: true,
      data: this.user,
    });
    dialogRef.beforeClosed().subscribe(
      result => {
        this.paymentService.getPaymentMethodByUserID(this.user.user_id).subscribe(
          result => {
            this.payments = result;
          }
        );
      }
    );
  }

  openDialogShipping() {
    const dialogRef = this.dialog.open(ShippingAddressDialogComponent, {
      width: '750px',
      height: '700px',
      disableClose: true,
      data: this.user,
    });
    dialogRef.beforeClosed().subscribe(
      result => {
        this.shippingService.getShippingAddressByUserID(this.user.user_id).subscribe(
          result => {
            this.shippings = result;
          }
        );
      }
    );
  }

  deletePaymentMethod(userId, paymentNo) {
    const dialogConfirm = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      height: '200px',
      disableClose: true,
      data: '削除'
    });
    dialogConfirm.beforeClosed().subscribe(
      result => {
        if (result) {
          this.paymentService.deletePaymentMethod(userId, paymentNo).subscribe(res => {
            this.paymentService.getPaymentMethodByUserID(this.user.user_id).subscribe(
              result => {
                this.payments = result;
              }
            );
          })
          this.sharedService.openSnackBar("削除が成功にされました。", "削除")
        }
      },
      (err)=>{
        this.sharedService.openSnackBar("削除できませんでした。", "削除")
      }
    );
  }

  updatePaymentMethod(paymentInfo) {
    const dialogRef = this.dialog.open(UpdatePaymentmethodDialogComponent, {
      width: '750px',
      height: '700px',
      disableClose: true,
      data: paymentInfo,
    });
    dialogRef.beforeClosed().subscribe(
      result => {
        this.paymentService.getPaymentMethodByUserID(this.user.user_id).subscribe(
          result => {
            this.payments = result;
          }
        );
      }
    );
  }

  deleteShippingAddress(shippingAddreessNo) {
    const dialogConfirm = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      height: '200px',
      disableClose: true,
      data: '削除'
    });
    dialogConfirm.beforeClosed().subscribe(
      result => {
        if (result) {
          this.shippingService.deleteShippingAddress(this.user.user_id, shippingAddreessNo).subscribe(
            (): void => {
              this.shippingService.getShippingAddressByUserID(this.user.user_id).subscribe(
                result => {
                  this.shippings = result;
                }
              );
            }
          );
          this.sharedService.openSnackBar("削除が成功にされました。", "削除")
        }
      },
      (err)=>{
        this.sharedService.openSnackBar("削除できませんでした。", "削除")
      }
    );
  }

  updateShippingAddress(shippingAddreessNo) {
    const dialogRef = this.dialog.open(ShippingAddressUpdateDialogComponent, {
      width: '750px',
      height: '700px',
      disableClose: true,
      data: {
        user_id: this.user.user_id,
        shipping_address_no: shippingAddreessNo
      },
    });
    dialogRef.beforeClosed().subscribe(
      result => {
        if (result) {
          this.shippingService.getShippingAddressByUserID(this.user.user_id).subscribe(
            result => {
              this.shippings = result;
            }
          );
        }

      }
    );
  }

  isNumber(evt) {
    evt = (evt) ? evt: window.event;
    let charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 47 || charCode > 57)) {
      return false;
    }
    return true;
  }
}
