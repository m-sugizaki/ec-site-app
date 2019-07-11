import { Component, OnInit, Input, SimpleChanges, forwardRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { UserService } from 'src/app/services/user.service';
import { SharedService } from 'src/app/services/shared.service';
import { LoginDialogComponent } from '../../login-dialog/login-dialog';
import { MatDialog } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { ReviewService } from 'src/app/services/review.service';
import { ProductCartService } from 'src/app/services/product-cart.service';
import { ProductCartBuyDialogComponent } from '../../product-cart-buy-dialog/product-cart-buy-dialog.component';
import { Review } from 'src/app/shared/reviewModel';
import { User } from 'src/app/shared/userModel';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
  providers: [ProductService , DecimalPipe],
})

export class ProductDetailComponent implements OnInit {

  @Input() product_id
  image
  value
  product_detail: any = {
    primaryKey: { productId: '' },
    productName: '',
    maker: '',
    price: '',
    salePoint: '',
    image: '',
    stockQuantity: '',
    similar_product_id: '',
    color: '',
    size: '',
  }
  data = {
    product_id: '',
    color: '',
    size: '',
    quantity: ''
  }
  quantity: any = 1
  purchasePrice: any = 0
  sizeList = []
  colorList = []
  similarProductList = []
  reviewTable = []
  userList = []
  message
  displayedColumns: string[] = ['reviewNo', 'nickname', 'evaluation', 'reviewContent', 'reviewDt'];


  constructor(
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private reviewService: ReviewService,
    private userService: UserService,
    private sharedService: SharedService,
    private productCartService: ProductCartService,
    public dialog: MatDialog,
    private router: Router,
    private decimalPipe: DecimalPipe,

  ) {
    this.product_id = this.activatedRoute.snapshot.params.product_id || null
    this.activatedRoute.params.subscribe(routeParams => {
      if (routeParams.product_id !== this.product_id) {
        this.product_id = routeParams.product_id
        window.localStorage.setItem("quantity", '1')
        window.localStorage.setItem("color", '')
        window.localStorage.setItem("size", '')
        this.ngOnInit()
      }
    });
  }

  ngOnInit() {
    this.getProductInfo()
    this.reviewTable = this.sharedService.getReviewOfProduct(this.product_id)
    this.quantity = localStorage.getItem("quantity") || 1
  }

  getProductInfo() {
    this.productService.getProductInfo(this.product_id).subscribe(res => {
      this.product_detail = res
      document.getElementById("ItemPreview").setAttribute('src', "data:image/png;base64," + this.product_detail.image);
      this.colorList = res.color.split(',')
      this.sizeList = res.size.split(',')
      this.similarProductList = res.similarProductId.split(',')
      this.product_detail.color = localStorage.getItem("color") || this.colorList[0]
      this.product_detail.size = localStorage.getItem("size") || this.sizeList[0]
      this.product_detail.similar_product_id = this.similarProductList[0]
      //this.product_detail.price_string = this.decimalPipe.transform(this.product_detail.price, '1.1-2')
    })
  }

  submit() {

    this.message = '';
    let quantityFormat = '^[0-9]+$'
    let isValid = true;
    let postalCode = new FormControl(this.quantity, Validators.compose([Validators.pattern(quantityFormat)]))
    if (this.quantity == '' && isValid === true) {
      this.message = '数量 を入力してください。';
      return
    }
    if (isValid === true && postalCode.status === "INVALID") {
      this.message = '数量 のフォーマットが正しくないです。';
      return
    }
    if (localStorage.getItem("token")) {
      this.userService.getUserInfo().subscribe((res: any) => {
        console.log(Object.keys(res).length)
        if (Object.entries(res).length !== 0 ) {
          this.productService.insertNewProductCart(this.product_detail, this.quantity, res.primaryKey.userId).subscribe(res2 => {
            this.sharedService.openSnackBar("商品カートが成功に登録されました。", "")
            this.productCartService.getProductCartInfoByUserID(res.primaryKey.userId).subscribe((res3: any) => {
              let userModel = new User()
              res3.length === 0 ? userModel.hasProductCart = '無' : userModel.hasProductCart = '有'
              this.sharedService.setHasProductCart(userModel.hasProductCart)
            })
          },
          err => {
            this.sharedService.openSnackBar("商品購入が更新されませんでした。", "")
            return
          })
        }
      },
        err => {
          this.sharedService.openSnackBar("商品カートが登録されませんでした。", "")
        })
    } else {
      this.sharedService.openSnackBar("まずログインしてください。", "")
      const dialogRef = this.dialog.open(LoginDialogComponent, {
        width: '750px',
        height: '500px',
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          window.localStorage.setItem("quantity", this.quantity)
          window.localStorage.setItem("color", this.product_detail.color)
          window.localStorage.setItem("size", this.product_detail.size)
          location.reload()
        }
      });
    }

  }

  openDialogProductCartBuy(productId) {
    let quantityFormat = '^[0-9]+$'
    let isValid = true;
    let postalCode = new FormControl(this.quantity, Validators.compose([Validators.pattern(quantityFormat)]))
    if (this.quantity == '' && isValid === true) {
      this.message = '数量 を入力してください。';
      return
    }
    if (isValid === true && postalCode.status === "INVALID") {
      this.message = '数量 のフォーマットが正しくないです。';
      return
    }
    this.userService.isLoggedIn().subscribe(res => {
      if (res) {
        this.data.product_id = productId;
        this.data.quantity = this.quantity;
        this.data.color = this.product_detail.color;
        this.data.size = this.product_detail.size;
        const dialogRef = this.dialog.open(ProductCartBuyDialogComponent, {
          width: '750px',
          height: '700px',
          disableClose: true,
          data: this.data

        });
        dialogRef.afterClosed().subscribe(result => {

        });
      }
      else {
        this.sharedService.openSnackBar("まずログインしてください。", "")
        const dialogRef = this.dialog.open(LoginDialogComponent, {
          width: '750px',
          height: '500px',
          disableClose: true,
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            window.localStorage.setItem("quantity", this.quantity)
            window.localStorage.setItem("color", this.product_detail.color)
            window.localStorage.setItem("size", this.product_detail.size)
            location.reload()
          }
        });
      }
    },
      err => {
        this.sharedService.openSnackBar("商品カートが登録されませんでした。", "")
      })

  }
}
