import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { SharedService } from 'src/app/services/shared.service';
import { Router } from '@angular/router';
import { ReviewService } from 'src/app/services/review.service';
import { RegistryReviewInfoDialogComponent } from './registry-review-info-dialog/registry-review-info-dialog.component';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-review-info-dialog',
  templateUrl: './review-info-dialog.component.html',
  styleUrls: ['./review-info-dialog.component.scss']
})
export class ReviewInfoDialogComponent implements OnInit {

  product_id
  reviewTable = []
  data2 = {
    product_id: '',
    flag: '',
    evaluation: '',
    nickname: '',
    reviewContent: '',
    reviewNo: '',
    userId: '',
  }
  loggedInUser
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sharedService: SharedService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<ReviewInfoDialogComponent>,
    private router: Router,
    private reviewService: ReviewService,
    private userService: UserService,
  ) { }

  ngOnInit() {
    this.userService.getUserInfo().subscribe(res => {
      this.loggedInUser = res.primaryKey.userId;
    })
    this.product_id = this.data
    this.getReviewInfo()
  }

  getReviewInfo() {
    this.reviewTable = this.sharedService.getReviewOfProduct(this.product_id)
  }

  openDialogRegistry() {
    this.data2.product_id = this.product_id
    this.data2.flag = '登録'
    const dialogRef = this.dialog.open(RegistryReviewInfoDialogComponent, {
      width: '650px',
      height: '540px',
      disableClose: true,
      data: this.data2,
    });

    dialogRef.afterClosed().subscribe(res => {
      if(res){
        this.getReviewInfo()
      }
    });
  }

  confirmDelete(reviewNo) {
    const dialogConfirm = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      height: '200px',
      disableClose: true,
      data : '削除',
    });
    dialogConfirm.beforeClosed().subscribe(res => {
      if(res){
        this.reviewService.deleteReview(this.product_id, reviewNo).subscribe(res => {

        })
        this.sharedService.openSnackBar("削除が成功にされました。","")
        this.dialogRef.close(true);
      }
    },
    err => {
      this.sharedService.openSnackBar("削除できませんでした。","")
    })
  }

  update(review) {
      this.data2.product_id = review.productId
      this.data2.evaluation = review.evaluation
      this.data2.nickname = review.nickname
      this.data2.reviewContent = review.reviewContent
      this.data2.reviewNo = review.reviewNo
      this.data2.userId = review.userId
      this.data2.flag = '更新'
      const dialogRef = this.dialog.open(RegistryReviewInfoDialogComponent, {
        width: '650px',
        height: '540px',
        disableClose: true,
        data: this.data2,
      });

      dialogRef.afterClosed().subscribe(res => {
        if(res){
          this.getReviewInfo()
        }
      });
  }

  reviewComileFinish() {
    this.dialogRef.close(true);
  }
}
