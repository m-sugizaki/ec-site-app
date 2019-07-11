import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA,  } from '@angular/material'

import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl,  } from '@angular/forms';
import { SharedService } from 'src/app/services/shared.service';
import { ShippingService } from 'src/app/services/shipping.service';

@Component({
  selector: 'app-shipping-address-update-dialog',
  templateUrl: './shipping-address-update-dialog.component.html',
  styleUrls: ['./shipping-address-update-dialog.component.scss']
})
export class ShippingAddressUpdateDialogComponent implements OnInit {

  message
  shippingAddress : any = {
    user_id:'',
    shipping_address_no:'',
    postal_code:'',
    address1:'',
    address2:'',
    phone_number:'',
    shipping_address_name:''
  };
  constructor(
    private router: Router,
    public dialogRef: MatDialogRef<ShippingAddressUpdateDialogComponent>,
    private shippingService: ShippingService,
    private sharedService: SharedService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.shippingAddress.user_id = this.data.user_id;
    this.shippingAddress.shipping_address_no=this.data.shipping_address_no
    this.shippingService.getShippingAddressInfo(this.shippingAddress.user_id,this.shippingAddress.shipping_address_no).subscribe(
      result=>{
        this.shippingAddress.postal_code=result.postalCode;
        this.shippingAddress.address1=result.address1;
        this.shippingAddress.address2 = result.address2;
        this.shippingAddress.phone_number = result.phoneNumber;
        this.shippingAddress.shipping_address_name = result.shippingAddressName;
      }
    );
  }
  updateShippingAddress(){
    this.message='';
    let phoneFormat = '[0-9]{2,5}-[0-9]{1,4}-[0-9]{4,4}'
    let postalCodeFormat = '[0-9]{3}-[0-9]{4}'
    let isValid = true;
    let postalCode = new FormControl(this.shippingAddress.postal_code, Validators.compose([Validators.pattern(postalCodeFormat)]))
    let phoneNumber = new FormControl(this.shippingAddress.phone_number, Validators.compose([Validators.pattern(phoneFormat)]))
    if (isValid === true && this.shippingAddress.postal_code === '') {
      this.message = '郵便番号 を入力してください。';
      isValid = false;
    }
    if (isValid === true && this.shippingAddress.address1 === '') {
      this.message = '住所1 を入力してください。';
      isValid = false;
    }
    if (isValid === true && this.shippingAddress.phone_number === '') {
      this.message = '電話番号 を入力してください。';
      isValid = false;
    }
    if (isValid === true && this.shippingAddress.shipping_address_name === '') {
      this.message = 'お届け先名 を入力してください。';
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
    if(isValid)
    {
      this.shippingService.updateShippingAddress(this.shippingAddress).subscribe(
        result=>{
          this.dialogRef.close(true);
        }
      );
    }
    else
    {
      return
    }

  }
  Cancel(){
    this.dialogRef.close();
  }
}
