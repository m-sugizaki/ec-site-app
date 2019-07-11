import { Component, OnInit, Inject } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDatepicker, DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material';
import { PaymentService } from 'src/app/services/payment.service';
import { Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-signup-paymentmethod-dialog',
  templateUrl: './signup-paymentmethod-dialog.component.html',
  styleUrls: ['./signup-paymentmethod-dialog.component.scss'],
  providers: [UserService,],
})


export class SignupPaymentmethodDialogComponent implements OnInit {

  message: any;
  moth = '01';
  moths=['01','02','03','04','05','06','07','08','09','10','11','12'];
  year = 2019;
  years = [];
  constructor(
    public dialogRef: MatDialogRef<SignupPaymentmethodDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private paymentService: PaymentService,
  ) { }
  info: any = {
    user_id: '',
    payment_no: '',
    payment_method: '',
    card_number: '',
    expiration_date: '',
    owner_name: '',
  }
  ngOnInit() {
    this.info.user_id = this.data.user_id
    this.paymentService.getMaxPaymentMethodNoOfUser(this.info.user_id).subscribe((res: any) => {
      //this.info.payment_no = res + 1
    });
    let date = new Date();
    for(let i=date.getFullYear();i<date.getFullYear()+5;i++)
    {
      this.years.push(i);
    }

  }

  Submit() {
    this.message='';
    let isValid = true;
    let cardNumber_format = '[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{4}'
    let expiration_date_format = '[0-9]{2,2}/[0-9]{2,2}'
    let cardNumber = new FormControl(this.info.card_number, Validators.compose([Validators.pattern(cardNumber_format)]))
    
    if (isValid === true && this.info.payment_method === '') {
      this.message = '支払方法 を入力してください。';
      isValid = false;
    }
    if (isValid === true && this.info.card_number === '') {
      this.message = 'ｶｰﾄﾞ番号 を入力してください。';
      isValid = false;
    }
    
    if (isValid === true && this.info.owner_name === '') {
      this.message = 'ｶｰﾄﾞ名義人 を入力してください。';
      isValid = false;
    }
    if (isValid === true && cardNumber.status === "INVALID") {
      this.message = 'ｶｰﾄﾞ番号のフォーマットが正しくないです。\n';
      isValid = false;
    }
    
    if(isValid) {
      
      this.info.expiration_date = this.year+"-"+this.moth+"-02";
      this.paymentService.insertNewPaymentMethod(this.info).subscribe(res => {
        if(res){
          this.dialogRef.close(res);
        }
      });
    }
    else return
  }

  Cancel() {
    this.dialogRef.close();
  }
}
