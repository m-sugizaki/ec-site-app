import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA,  } from '@angular/material'

import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl,  } from '@angular/forms';
import { SharedService } from 'src/app/services/shared.service';
import { ProductService } from 'src/app/services/product.service';
import { ProductCartService } from 'src/app/services/product-cart.service';
import { DecimalPipe } from '@angular/common';
import { isNumber } from 'util';

@Component({
  selector: 'app-product-cart-update-dialog',
  templateUrl: './product-cart-update-dialog.component.html',
  styleUrls: ['./product-cart-update-dialog.component.scss'],
  providers: [DecimalPipe]
})
export class ProductCartUpdateDialogComponent implements OnInit {

  product_cart: any = {
    product_cart_id: '',
    product_id: '',
    product_name: '',
    user_id : '',
    price: '',
    quantity: '',
    total: '',
    size: '',
    color: '',
    cart_regist_dt: '',
  }
  price
  message
  sizes :Array<String> = [];
  colors :Array<String> = [];
  constructor(
    private router: Router,
    public dialogRef: MatDialogRef<ProductCartUpdateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private productService : ProductService,
    private productCartService : ProductCartService,
    private decimal: DecimalPipe
  ) { }

  ngOnInit() {
    this.productCartService.getProductCartInfoByKey(this.data).subscribe(
      (result:any)=>{
        this.product_cart.product_cart_id = result.productCartId;
        this.product_cart.product_id = result.productId;
        this.product_cart.quantity = result.quantity;
        this.product_cart.size = result.size;
        this.product_cart.color = result.color;
        this.product_cart.cart_regist_dt = result.cartRegistDt;
        this.product_cart.user_id = result.userId;
        
        this.productService.getProductInfo(result.productId).subscribe(
          (result2:any)=>{
            this.product_cart.product_name = result2.productName;
            this.price = result2.price;
            this.product_cart.price = this.decimal.transform(result2.price,'1.2-2');
            this.product_cart.total = this.decimal.transform(result2.price*this.product_cart.quantity,'1.2-2');         
           let size = result2.size;
            this.sizes = size.split(",");
            let color = result2.color;
            this.colors = color.split(",");
          }
        );
      }
    );
  }
  Cancel(){
    this.dialogRef.close();
  }
  updateProductCart()
  {
    let quantityFormat = '^[0-9]+$'
    let isValid = true;
    let postalCode = new FormControl(this.product_cart.quantity, Validators.compose([Validators.pattern(quantityFormat)]))
    
    if(this.product_cart.quantity == '' && isValid === true){
      this.message = '数量 を入力してください。';
      return
    }
    if(isValid === true && postalCode.status === "INVALID") {
      this.message = '数量 のフォーマットが正しくないです。';
      return
    }
    this.productCartService.updateProductCart(this.product_cart).subscribe(
      result=>{

        this.dialogRef.close(true);
      }
    );
  }
  Total()
  {
    this.product_cart.total = this.decimal.transform(this.price*this.product_cart.quantity,'1.2-2');  
  }
  





}
