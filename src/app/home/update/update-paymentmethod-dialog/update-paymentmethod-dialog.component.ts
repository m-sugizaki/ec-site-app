import { Component, OnInit, Inject } from '@angular/core';
import { PaymentService } from 'src/app/services/payment.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DatePipe } from '@angular/common';
import { Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-update-paymentmethod-dialog',
  templateUrl: './update-paymentmethod-dialog.component.html',
  styleUrls: ['./update-paymentmethod-dialog.component.scss'],
  providers: [DatePipe],
})
export class UpdatePaymentmethodDialogComponent implements OnInit {

  message: any
  info: any
  expirationDate
  moth 
  moths=['01','02','03','04','05','06','07','08','09','10','11','12'];
  year 
  years = [];
  constructor(
    private paymentService: PaymentService,
    public dialogRef: MatDialogRef<UpdatePaymentmethodDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
    this.info = this.data
    let date = new Date()
    for(let i=date.getFullYear();i<date.getFullYear()+5;i++)
    {
      this.years.push(i);
    }
    let date2 = new Date(this.datePipe.transform(this.info.expirationDate));
    this.moth = date2.getMonth()+1;
    this.moth = this.moth+'';
    if(this.moth.length==1)
    {
      this.moth = '0'+this.moth
    }
    this.year=date2.getFullYear();
    
  }

  Submit() {
    this.message='';
    let isValid = true;
    let cardNumber_format = '[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{4}'
    let expiration_date_format = '[0-9]{2,2}/[0-9]{2,2}'
    let cardNumber = new FormControl(this.info.cardNumber, Validators.compose([Validators.pattern(cardNumber_format)]))
    if (isValid === true && this.info.paymentMethod === '') {
      this.message = '支払方法 を入力してください。';
      isValid = false;
    }
    if (isValid === true && this.info.cardNumber === '') {
      this.message = 'ｶｰﾄﾞ番号 を入力してください。';
      isValid = false;
    }
    if (isValid === true && this.info.expirationDate === '') {
      this.message = '有効期限 を入力してください。';
      isValid = false;
    }
    if (isValid === true && this.info.cardHolderName === '') {
      this.message = 'ｶｰﾄﾞ名義人 を入力してください。';
      isValid = false;
    }
    if (isValid === true && cardNumber.status === "INVALID") {
      this.message = 'ｶｰﾄﾞ番号のフォーマットが正しくないです。\n';
      isValid = false;
    }
    if(isValid) {
      
      this.info.expirationDate = this.year+"-"+this.moth+"-01";
      this.paymentService.updatePaymentMethod(this.info).subscribe(res => {
        this.dialogRef.close(res);
      })
    }
    else return
  }

  Cancel() {
    this.dialogRef.close();
  }

}
