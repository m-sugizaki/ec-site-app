import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { ProductCartService } from '../../services/product-cart.service';
import { UserService } from '../../services/user.service';
import { ProductCart } from './product-cart';
import { DecimalPipe } from '@angular/common';
import { MatDialog, MatSnackBar ,MatDialogRef} from '@angular/material';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component'
import { ProductCartUpdateDialogComponent } from '../update/product-cart-update-dialog/product-cart-update-dialog.component'
import { SharedService } from 'src/app/services/shared.service';
import { ProductCartBuyDialogComponent } from '../product-cart-buy-dialog/product-cart-buy-dialog.component';
import { User } from 'src/app/shared/userModel';

@Component({
  selector: 'app-product-cart',
  templateUrl: './product-cart.component.html',
  styleUrls: ['./product-cart.component.scss'],
  providers: [DecimalPipe]

})
export class ProductCartComponent implements OnInit {

  product_cart: any = {
    product_cart_id: '',
    product_id: '',
    product_name: '',
    price: '',
    quantity: '',
    total: '',
    size: '',
    color: '',
    cart_regist_dt: '',
  }
  data : any = {
    product_id : '',
    color:'',
    size: '',
    quantity:'',
    product_cart_id:''
  }
  product_carts: Array<ProductCart> = [];
  userId
  productCartId
  productLst = []

  constructor(
    private router: Router,
    private productService: ProductService,
    private decimal: DecimalPipe,
    private productCartService: ProductCartService,
    private userService: UserService,
    private dialog : MatDialog,
    private sharedService : SharedService
  ) { }

  ngOnInit() {


    this.userService.getUserInfo().subscribe(
      result => {
        this.userId = result.primaryKey.userId;
        this.productCartService.getProductCartInfoByUserID(this.userId).subscribe(
          (result1: Array<any>) => {
            result1.forEach(element=>{
              this.productLst.push(element.productId);
            });
            this.product_carts=[];
            if(result1.length !== 0) {
              this.productService.getProductInfoByProductIDList(this.productLst).subscribe(
                (result2 : Array<any>)=>{
                  this.product_carts=[];
                  result1.forEach(element=>{
                    let pr = new ProductCart();
                    pr.product_id = element.productId;
                    pr.product_cart_id = element.productCartId;
                    pr.quantity = element.quantity;
                    pr.size = element.size;
                    pr.color = element.color;
                    pr.cart_regist_dt = element.cartRegistDt;
                    result2.forEach(element2=>{
                      if(element.productId === element2.primaryKey.productId)
                      {
                        pr.product_name = element2.productName;
                        pr.price = element2.price;
                        this.product_carts.push(pr);
                      }
                    });
                });
                let userModel = new User()
                this.product_cart.length === 0 ? userModel.hasProductCart = '無' : userModel.hasProductCart = '有'
              });
            }
          }
        );
      }
    );


  }
  OpenDialogDelete(productCartId)
  {
    this.productCartId=productCartId;
    const dialogConfirm = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      height: '200px',
      disableClose: true,
      data : '削除',
    });
    dialogConfirm.beforeClosed().subscribe(
      result => {
        if (result) {
          this.productCartService.deleteProductCart(this.productCartId).subscribe(
            ():void=>{
              this.ngOnInit();
              this.productCartService.getProductCartInfoByUserID(this.userId).subscribe((res3: any) => {
                let userModel = new User()
                res3.length === 0 ? userModel.hasProductCart = '無' : userModel.hasProductCart = '有'
                this.sharedService.setHasProductCart(userModel.hasProductCart)
              })
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
  OpenDialogUpdate(productCartId)
  {
    this.productCartId=productCartId;
    const dialogupdate = this.dialog.open(ProductCartUpdateDialogComponent, {
      width: '750px',
      height: '700px',
      disableClose: true,
      data : this.productCartId
    });
    dialogupdate.beforeClosed().subscribe(
      result => {
        if (result) {
              this.ngOnInit();
        }
      },
      (err)=>{
        this.sharedService.openSnackBar("削除できませんでした。", "削除")
      }
    );
  }
  OpenDialogBuy(productcart:any){
    this.data.product_id= productcart.product_id;
    this.data.quantity = productcart.quantity;
    this.data.color = productcart.color;
    this.data.size = productcart.size;
    this.data.product_cart_id = productcart.product_cart_id;
    const dialogbuy = this.dialog.open(ProductCartBuyDialogComponent, {
      width: '750px',
      height: '700px',
      disableClose: true,
      data : this.data
    });
    dialogbuy.beforeClosed().subscribe(
      result => {
          if(result!=false)
          {
            this.productCartService.deleteProductCart(result).subscribe(
              ():void=>{
                this.ngOnInit();
                this.productCartService.getProductCartInfoByUserID(this.userId).subscribe((res3: any) => {
                  let userModel = new User()
                  res3.length === 0 ? userModel.hasProductCart = '無' : userModel.hasProductCart = '有'
                  this.sharedService.setHasProductCart(userModel.hasProductCart)
                })
              }
            )
          }
      },
      (err)=>{
        this.sharedService.openSnackBar("削除できませんでした。", "削除")
      }
    );
  }

}
