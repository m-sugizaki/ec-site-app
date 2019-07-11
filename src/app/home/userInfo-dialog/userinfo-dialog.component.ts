import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, ErrorStateMatcher, MatDialog } from '@angular/material'
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { SharedService } from 'src/app/services/shared.service';
import { DatePipe } from '@angular/common';
import { ShippingAddressDialogComponent } from '../shipping-address-dialog/shipping-address-dialog.component';
import { SignupPaymentmethodDialogComponent } from '../signup-paymentmethod-dialog/signup-paymentmethod-dialog.component';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-userinfo-dialog',
  templateUrl: './userinfo-dialog.component.html',
  styleUrls: ['./userinfo-dialog.component.scss'],
  providers: [DatePipe],
})
export class UserinfoDialogComponent implements OnInit {

  logedInForm;
  message;

  constructor(
    private router: Router,
    public dialogRef: MatDialogRef<UserinfoDialogComponent>,
    private userService: UserService,
    private sharedService: SharedService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private datePipe: DatePipe,
    private dialog: MatDialog,
  ) { }

  user: any = {
    user_id: '',
    name: '',
    nickname: '',
    postalCode: '',
    address1: '',
    address2: '',
    phoneNumber: '',
    email: '',
    birthday: '',
    memberRank: '一般',
  }

  ngOnInit() {
    this.user.user_id = this.data.user_id
  }

  insertNewUserInfo() {
    let emailFormat = '/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/'
    let phoneFormat = '[0-9]{2,5}-[0-9]{1,4}-[0-9]{4,4}'
    let postalCodeFormat = '[0-9]{3}-[0-9]{4}'
    let dateFormat = '^[0-9]{4}[\/]?(((([0]{0,1}[13578])|(1[02]))[\/]?(([0-2]{0,1}[0-9])|(3[01])))|((([0]{0,1}[469])|(11))[\/]?(([0-2]{0,1}[0-9])|(30)))|([0]{0,1}2[\/]?[0-2]{0,1}[0-9]))$'
    let isValid = true;
    let postalCode = new FormControl(this.user.postalCode, Validators.compose([Validators.pattern(postalCodeFormat)]))
    let phoneNumber = new FormControl(this.user.phoneNumber, Validators.compose([Validators.pattern(phoneFormat)]))
    let email = new FormControl(this.user.email, Validators.compose([Validators.email]))
   // let birthday = new FormControl(this.datePipe.transform(this.user.birthday, "yyyy/MM/dd"), Validators.compose([Validators.pattern(dateFormat)]))
   let birthday = new FormControl(this.user.birthday, Validators.compose([Validators.pattern(dateFormat)]))

    this.message = '';
    if (this.user.name === '') {
      this.message = '氏名 を入力してください。';
      isValid = false;
    }
    if (isValid === true && this.user.nickname === '') {
      this.message = 'ﾆｯｸﾈｰﾑ を入力してください。';
      isValid = false;
    }
    if (isValid === true && this.user.postalCode === '') {
      this.message = '郵便番号 を入力してください。';
      isValid = false;
    }
    if (isValid === true && this.user.address1 === '') {
      this.message = '住所1 を入力してください。';
      isValid = false;
    }
    if (isValid === true && this.user.phoneNumber === '') {
      this.message = '電話番号 を入力してください。';
      isValid = false;
    }
    if (isValid === true && this.user.email === '') {
      this.message = 'E-mail を入力してください。';
      isValid = false;
    }
    if (isValid === true && this.user.birthday === '') {
      this.message = '生年月日 を入力してください。';
      isValid = false;
    }
    if (isValid === true && this.user.memberRank === '') {
      this.message = '会員ﾗﾝｸ を入力してください。';
      isValid = false;
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
    if ((isValid === true && birthday.status === "INVALID")) {
      this.message = '日付のフォーマットが正しくないです。\n';
      isValid = false;
    }
    let date = this.user.birthday.split('/');
    if((Number(date[1])==2&&Number(date[0])>28)&&isValid === true)
    {
      if(!(Number(date[0]) % 4 == 0 && Number(date[0]) % 100 != 0))
      {
        
        this.message = '日付のフォーマットが正しくないです。\n';
        isValid = false;
      }
      
     }
    if (isValid) {
      this.user.birthday = new Date(this.user.birthday);
      this.userService.insertNewUserInfo(this.user).subscribe(
        result => {
          if (result != null) {
            this.userService.login(this.data.user_id, this.data.password).subscribe(res => {
              if(res){
                //this.router.navigate(['/home'])
                this.dialogRef.close(res)
              }
            })
            this.sharedService.openSnackBar("登録に成功しました。", "登録")
          }
        }
      );
    }
    else return
  }
  onNoClick() {
    this.dialogRef.close();
  }
  openDialogPaymentMethod(): void {
    const dialogRef = this.dialog.open(SignupPaymentmethodDialogComponent, {
      width: '750px',
      height: '700px',
      disableClose: true,
      data: this.user,
    });

  }

  openDialogShippingAddress()
  {
    const dialogRefShipping = this.dialog.open(ShippingAddressDialogComponent, {
      width: '750px',
      height: '700px',
      disableClose: true,
      data:this.user,
    });
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
