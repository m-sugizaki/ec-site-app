import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { ProductService } from 'src/app/services/product.service';
import { ReviewService } from 'src/app/services/review.service';
import { MatDialog } from '@angular/material';
import { CancelOrderDialogComponent } from './cancel-order-dialog/cancel-order-dialog.component';
import { ProductCartService } from 'src/app/services/product-cart.service';
import { SharedService } from 'src/app/services/shared.service';
import { ReviewInfoDialogComponent } from './review-info-dialog/review-info-dialog.component';
import { RegistryReviewInfoDialogComponent } from './review-info-dialog/registry-review-info-dialog/registry-review-info-dialog.component';
import { ProductCartBuyDialogComponent } from '../product-cart-buy-dialog/product-cart-buy-dialog.component';
import { PurchaseResultsService } from 'src/app/services/purchase-results.service';
import { User } from 'src/app/shared/userModel';

export class PurchaseResult {
  orderDate: any; //res
  orderNo: any;  //res
  productId: any; //res
  productName: any; //res2
  orderStatus: any; //res
  deliveryPlanDt: any; //res
  deliveryCompletionDt: any; //res
  evaluation: any; //res3
  price: any; //res2
  quantity: any; //res
  summary: any;
  size: any; //res
  color: any; //res
  paymentNo : any;
  shippingAddressNo:any;
  paymentMethod : any;
}

@Component({
  selector: 'app-purchase-history',
  templateUrl: './purchase-history.component.html',
  styleUrls: ['./purchase-history.component.scss']
})
export class PurchaseHistoryComponent implements OnInit {

  userId
  purchaseResult = []
  productIdLst = []
  data = {
    product_id : '',
    color:'',
    size: '',
    quantity:'',
    flag: '',
    nickname: '',
    paymentNo: '',
    shippingAddressNo :'',
    paymentMethod:''
  }
  constructor(
    private purchaseResultService: PurchaseResultsService,
    private userService: UserService,
    private productService: ProductService,
    private reviewService: ReviewService,
    private productCartService: ProductCartService,
    private sharedService: SharedService,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.getProductInfo()
  }

  getProductInfo() {
    this.userService.getUserInfo().subscribe(res => {
      this.userId = res.primaryKey.userId;
      this.purchaseResultService.getPurchaseResultsInfoByUserIDList(this.userId).subscribe((res: any) => {
        res.forEach(element => {
          this.productIdLst.push(element.productId)
        });
        if(res.length !== 0) {
          this.productService.getProductInfoByProductIDList(this.productIdLst).subscribe((res2: any) => {
            res.forEach(element2 => {
              let purchase_result = new PurchaseResult()
              purchase_result.orderDate = element2.orderDt //res
              purchase_result.orderNo = element2.orderNo  //res
              purchase_result.productId = element2.productId//res
              purchase_result.orderStatus = element2.orderStatus //res
              purchase_result.deliveryCompletionDt = element2.deliveryCompletionDt //res
              purchase_result.deliveryPlanDt = element2.deliveryPlanDt //res
              purchase_result.quantity = element2.quantity
              purchase_result.color = element2.color
              purchase_result.size = element2.size
              purchase_result.paymentNo = element2.paymentNo
              purchase_result.shippingAddressNo = element2.shippingAddressNo
              purchase_result.paymentMethod = element2.paymentMethod
                res2.forEach(element3 => {
                  if(element2.productId === element3.primaryKey.productId) {
                    purchase_result.productName = element3.productName //res2
                    purchase_result.price = element3.price
                    purchase_result.summary = purchase_result.price * purchase_result.quantity
                    this.reviewService.getLastReviewInfoByProductID(element2.productId).subscribe((res3: any) => {
                      purchase_result.evaluation = res3.evaluation
                    })
                    this.purchaseResult.push(purchase_result)
                  }
                });
            });
          })
        }
      })
    })
  }

  openDialogCancelOrder(result) {
    const dialogRef = this.dialog.open(CancelOrderDialogComponent, {
      width: '650px',
      height: '750px',
      disableClose: true,
      data: result,
    });

    dialogRef.afterClosed().subscribe(res => {
      if(res) {
        this.purchaseResult = []
        this.getProductInfo()
      }
    });
  }

  addToCart(result) {
    this.productCartService.insertNewProductCart(result, this.userId).subscribe(res => {
        this.sharedService.openSnackBar("商品カートが成功に登録されました。", "")
        this.productCartService.getProductCartInfoByUserID(this.userId).subscribe((res3: any) => {
          let userModel = new User()
          res3.length === 0 ? userModel.hasProductCart = '無' : userModel.hasProductCart = '有'
          this.sharedService.setHasProductCart(userModel.hasProductCart)
        })
    })
  }

  goToCheckout(result) {
    this.data.product_id = result.productId
    this.data.color = result.color
    this.data.quantity = result.quantity
    this.data.size = result.size
    this.data.shippingAddressNo = result.shippingAddressNo
    this.data.paymentNo = result.paymentNo;
    this.data.paymentMethod = result.paymentMethod;
    const dialogRef = this.dialog.open(ProductCartBuyDialogComponent, {
      width: '1000px',
      height: '900px',
      disableClose: true,
      data: this.data,
    });

    dialogRef.afterClosed().subscribe(res => {
      if(res === false){

      } else {
        this.purchaseResult = []
        this.getProductInfo()
      }
    });
  }

  goToReviewInfo(productId) {
    const dialogRef = this.dialog.open(ReviewInfoDialogComponent, {
      width: '1000px',
      height: '800px',
      disableClose: true,
      data: productId,
    });

    dialogRef.afterClosed().subscribe(res => {
      if(res) {
        this.purchaseResult = []
        this.getProductInfo()
      }
    });
  }

  goToRegistryReview(productId) {
    this.data.product_id = productId
    this.data.flag = '登録'
    const dialogRef = this.dialog.open(RegistryReviewInfoDialogComponent, {
      width: '650px',
      height: '485px',
      disableClose: true,
      data: this.data,
    });

    dialogRef.afterClosed().subscribe(res => {
      if(res) {
        this.purchaseResult = []
        this.getProductInfo()
      }
    });
  }
}
