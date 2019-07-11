import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog,  } from '@angular/material'
import { DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl,  } from '@angular/forms';
import { SharedService } from 'src/app/services/shared.service';
import { UserService } from 'src/app/services/user.service';
import { ShippingService } from 'src/app/services/shipping.service';
import { ProductService } from 'src/app/services/product.service';
import { ProductCartService } from 'src/app/services/product-cart.service';
import { PaymentService } from 'src/app/services/payment.service';
import { ShippingAddressDialogComponent } from '../shipping-address-dialog/shipping-address-dialog.component';
import { ShippingAddressUpdateDialogComponent } from '../update/shipping-address-update-dialog/shipping-address-update-dialog.component';
import { SignupPaymentmethodDialogComponent } from '../signup-paymentmethod-dialog/signup-paymentmethod-dialog.component';
import { UpdatePaymentmethodDialogComponent } from '../update/update-paymentmethod-dialog/update-paymentmethod-dialog.component';
import { PurchaseResultsService } from 'src/app/services/purchase-results.service';


@Component({
  selector: 'app-product-cart-buy-dialog',
  templateUrl: './product-cart-buy-dialog.component.html',
  styleUrls: ['./product-cart-buy-dialog.component.scss'],
  providers: [DecimalPipe]
})
export class ProductCartBuyDialogComponent implements OnInit {

  product_cart_buy :any = {
    user_id:'',
    product_cart_id:'',
    product_id:'',
    product_name:'',
    price:'',
    quantity:'',
    total:'',
    size : '',
    color  : '',
    order_dt:'',
    order_status:'',
    payment_method:'',
    payment_no:'',
    shipping_address_no:'',
    delivery_plan_dt:'',
    delivery_completion_dt:'',
    address:'',
    shipping:'',
    payment:''
  }
  sizes;
  colors;
  shippingAddress;
  payments;
  message;
  paymentInfo;
  radioPayment=1 ;
  radioShipping =1 ;
  price

  constructor(
    private router: Router,
    public dialogRef: MatDialogRef<ProductCartBuyDialogComponent>,
    private sharedService: SharedService,
    private formBuilder: FormBuilder,
    private userService : UserService,
    private shippingService : ShippingService,
    private productService : ProductService,
    private product_cartService: ProductCartService,
    private paymentService : PaymentService,
    @Inject(MAT_DIALOG_DATA) public data,
    private decimal: DecimalPipe,
    private dialog: MatDialog,
    private purchaseService : PurchaseResultsService,


  ) { }

  ngOnInit() {
    this.userService.getUserInfo().subscribe(
      result=>{
        this.product_cart_buy.user_id = result.primaryKey.userId;
        this.product_cart_buy.address = result.address1 + "    " + result.address2;
        this.shippingService.getShippingAddressByUserID(this.product_cart_buy.user_id).subscribe(
          result3=>{
                this.shippingAddress = result3;
                if(this.shippingAddress!=''&&this.data.shippingAddressNo==null)
                {
                  this.product_cart_buy.shipping = this.shippingAddress[0].primaryKey.shippingAddressNo;
                }
          }
        );
        this.paymentService.getPaymentMethodByUserID(this.product_cart_buy.user_id).subscribe(
          result2 =>{
            this.payments = result2;
            if(this.payments!=''&&this.data.paymentNo==null)
            {
              this.product_cart_buy.payment = this.payments[0].primaryKey.paymentNo;
            }
          }
        );
      }
    );
            this.product_cart_buy.product_cart_id = this.data.product_cart_id;
            this.product_cart_buy.product_id = this.data.product_id;
            this.product_cart_buy.quantity= this.data.quantity;
            this.product_cart_buy.size = this.data.size;
            this.product_cart_buy.color = this.data.color;
            this.product_cart_buy.payment_method = this.data.paymentMethod;
            if(this.data.paymentNo!=null)
            {
              this.product_cart_buy.payment = this.data.paymentNo;
              this.product_cart_buy.shipping = this.data.shippingAddressNo;
              if(this.product_cart_buy.payment !=0)
              {
                  this.radioPayment=3;
              }
              else{
                if(this.product_cart_buy.payment_method==='銀行振込み')
                {
                  this.radioPayment=1;
                }
                else
                {
                  this.radioPayment=2;
                }
              }
              if(this.product_cart_buy.shipping !=0)
              {
                  this.radioShipping=2;
              }
            }
            
            
            this.productService.getProductInfo(this.product_cart_buy.product_id).subscribe(
              (result2:any)=>{
                this.product_cart_buy.product_name = result2.productName;
                this.price = result2.price;
                this.product_cart_buy.price =this.decimal.transform(this.price,'1.2-2');
                this.product_cart_buy.total = this.decimal.transform(this.price*this.product_cart_buy.quantity,'1.2-2');
                let size = result2.size;
                this.sizes = size.split(",");
                let color = result2.color;
                this.colors = color.split(",");
              }
            );
            



  }

  Cancel(){
    this.dialogRef.close(false);
  }
  onSubmit()
  {
    let quantityFormat = '^[0-9]+$'
    let isValid = true;
    let postalCode = new FormControl(this.product_cart_buy.quantity, Validators.compose([Validators.pattern(quantityFormat)]))
    this.message = '';
    if(this.product_cart_buy.quantity == '' && isValid === true){
      this.message = '数量 を入力してください。';
      isValid=false;
      return
    }
    if(isValid === true && postalCode.status === "INVALID") {
      this.message = '数量は数値で入力してください。';
      isValid=false;
      return
    }
    if(isValid===true && this.radioPayment==3)
    {
      if(this.payments=='')
      {
        this.message = 'クレジットカード情報を追加してください。';
        isValid=false;
        return
      }
      if(this.product_cart_buy.payment=='')
      {
        this.message = 'クレジットカード情報を選択してください。';
        isValid=false;
        return
      }

    }
    if(isValid===true && this.radioShipping==2)
    {
      if(this.shippingAddress=='')
      {
        this.message = 'お届け先情報を追加してください。';
        isValid=false;
        return
      }
      if(this.product_cart_buy.shipping=='')
      {
        this.message = 'お届け先情報を選択してください。';
        isValid=false;
        return
      }

    }
    if(isValid)
    {
      if(this.radioPayment==3)
      {
        this.product_cart_buy.payment_no = this.product_cart_buy.payment;
        this.product_cart_buy.payment_method = "クレジットカード";

      }
      else{
        if(this.radioPayment==1)
        {
          this.product_cart_buy.payment_method = "銀行振込み";
        }
        if(this.radioPayment==2)
        {
          this.product_cart_buy.payment_method = "商品代引き";
        }
        this.product_cart_buy.payment_no = '0';
      }
      if(this.radioShipping==2)
      {
        this.product_cart_buy.shipping_address_no = this.product_cart_buy.shipping;
      }
      else
      {
        this.product_cart_buy.shipping_address_no = '0';
      }
      this.purchaseService.insertPurchaseResult(this.product_cart_buy).subscribe(
        ():void=>{
            this.sharedService.openSnackBar("商品購入が成功に登録されました。","");
            this.dialogRef.close(this.product_cart_buy.product_cart_id);
        },
        err=>{
            this.sharedService.openSnackBar("商品購入が更新されませんでした。","");
        }

      );



    }



  }
  openDialogAddShipping()
  {
    const dialogRef = this.dialog.open(ShippingAddressDialogComponent, {
      width: '750px',
      height: '700px',
      disableClose: true,
      data: this.product_cart_buy,
    });
    dialogRef.beforeClosed().subscribe(
      result => {
        this.shippingService.getShippingAddressByUserID(this.product_cart_buy.user_id).subscribe(
          result => {
            if(this.shippingAddress=='')
                {
                  this.shippingAddress = result;
                  this.product_cart_buy.shipping = this.shippingAddress[0].primaryKey.shippingAddressNo;
                }
                this.shippingAddress = result;

          }
        );
      }
    );
  }
  openDialogUpdateShipping()
  {
    if(this.product_cart_buy.shipping ==='')
    {
      this.message = 'お届け先情報がないので、更新できません。';
      return
    }
    const dialogRef = this.dialog.open(ShippingAddressUpdateDialogComponent, {
      width: '750px',
      height: '700px',
      disableClose: true,
      data: {
        user_id: this.product_cart_buy.user_id,
        shipping_address_no: this.product_cart_buy.shipping
      },
    });
    dialogRef.beforeClosed().subscribe(
      result => {
        if (result) {
          this.shippingService.getShippingAddressByUserID(this.product_cart_buy.user_id).subscribe(
            result => {
              this.shippingAddress = result;
            }
          );
        }

      }
    );
  }
  openDialogUpdatePayment()
  {
    if(this.product_cart_buy.payment ==='')
    {
      this.message = 'クレジットカード情報がないので、更新できません。';
      return
    }
    for(let payment of this.payments)
    {
      if(payment.primaryKey.paymentNo==this.product_cart_buy.payment)
      {
          this.paymentInfo = payment;
          const dialogRef = this.dialog.open(UpdatePaymentmethodDialogComponent, {
            width: '750px',
            height: '700px',
            disableClose: true,
            data: this.paymentInfo,
          });
          dialogRef.beforeClosed().subscribe(
            result => {
              this.paymentService.getPaymentMethodByUserID(this.product_cart_buy.user_id).subscribe(
                result => {
                  this.payments = result;
                }
              );
            }
          );
          break;
      }
    }


  }
  openDialogAddPayment()
  {
    const dialogRef = this.dialog.open(SignupPaymentmethodDialogComponent, {
      width: '750px',
      height: '700px',
      disableClose: true,
      data: this.product_cart_buy,
    });
    dialogRef.beforeClosed().subscribe(
      result => {
        this.paymentService.getPaymentMethodByUserID(this.product_cart_buy.user_id).subscribe(
          result => {
            if(this.payments=='')
            {
              this.payments = result;
              this.product_cart_buy.payment = this.payments[0].primaryKey.paymentNo;
            }
            this.payments = result;

          }
        );
      }
    );

  }
  Total()
  {
    this.product_cart_buy.total = this.decimal.transform(this.price*this.product_cart_buy.quantity,'1.2-2');
  }

}
