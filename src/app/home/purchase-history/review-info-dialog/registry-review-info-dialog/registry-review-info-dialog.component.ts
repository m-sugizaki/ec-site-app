import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { SharedService } from 'src/app/services/shared.service';
import { Router } from '@angular/router';
import { ReviewService } from 'src/app/services/review.service';
import { UserService } from 'src/app/services/user.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-registry-review-info-dialog',
  templateUrl: './registry-review-info-dialog.component.html',
  styleUrls: ['./registry-review-info-dialog.component.scss']
})
export class RegistryReviewInfoDialogComponent implements OnInit {

  message
  product_id: any
  productName: any
  flag: any
  reviewInfo = {
    nickname: '',
    evaluation: '',
    review_content: '',
    reviewNo: '',
    userId: '',
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sharedService: SharedService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<RegistryReviewInfoDialogComponent>,
    private router: Router,
    private reviewService: ReviewService,
    private userService: UserService,
    private productService: ProductService,
  ) { }

  ngOnInit() {
    this.product_id = this.data.product_id
    this.flag = this.data.flag
    this.productService.getProductInfo(this.product_id).subscribe(res => {
      this.productName = res.productName
    })
    if(this.flag === '登録') {
      this.userService.getUserInfo().subscribe(res => {
        this.reviewInfo.nickname = res.nickname
        this.reviewInfo.userId = res.primaryKey.userId
      })
    } else {
      this.reviewInfo.nickname = this.data.nickname
      this.reviewInfo.evaluation = (this.data.evaluation).toString()
      this.reviewInfo.review_content = this.data.reviewContent
      this.reviewInfo.reviewNo = this.data.reviewNo
      this.reviewInfo.userId = this.data.userId
    }
  }

  confirm() {
    if(this.reviewInfo.evaluation === '') {
      this.message = "評価の値を入力してください。"
      return
    }
    if(this.reviewInfo.review_content === '') {
      this.message = "口ｺﾐ内容の値を入力してください。"
      return
    }

    if(this.flag === '更新') {
      this.reviewService.updateReviewInfo(this.reviewInfo, this.product_id).subscribe(res => {
        this.dialogRef.close(true)
        this.sharedService.openSnackBar("口コミ情報が成功に更新されました。", "")
      },
      err => {
        this.sharedService.openSnackBar("口コミ情報が更新されませんでした。", "")
      })
    } else {
      this.reviewService.insertNewReviewInfo(this.reviewInfo, this.product_id).subscribe(res => {
        this.dialogRef.close(true)
        this.sharedService.openSnackBar("口コミ情報が成功に登録されました。", "")
      },
      err => {
        this.sharedService.openSnackBar("口コミ情報が登録されませんでした。", "")
      })
    }
  }

  cancel() {
    this.dialogRef.close(false);
  }
}
