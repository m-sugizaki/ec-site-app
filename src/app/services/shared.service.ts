import { Injectable } from '@angular/core';
import { MatSnackBar} from '@angular/material'
import { ReviewService } from './review.service';
import { UserService } from './user.service';
import { Review } from '../shared/reviewModel';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  hasProductCart = new BehaviorSubject<string>('')
  defaultMsg: string
  reviewTable = []
  userList = []
  constructor(
    private snackBar: MatSnackBar,
    private reviewService: ReviewService,
    private userService: UserService,
  ) { }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
    });
  }

  getReviewOfProduct(productId){
    this.reviewTable = []
    this.reviewService.getReviewOfProduct(productId).subscribe(res => {
      res.forEach(element => {
        this.userList.push(element.userId)
      });
      if(res.length !== 0) {
        this.userService.getUserInfoByUserIdList(this.userList).subscribe(res2 => {
          res.forEach(element => {
            res2.forEach(element2 => {
              let review = new Review()
              if (element.userId === element2.primaryKey.userId) {
                review.nickname = element2.nickname
                review.evaluation = element.evaluation
                review.productId = element.primaryKey.productId
                review.reviewContent = element.reviewContent
                review.reviewDt = element.reviewDt
                review.reviewNo = element.primaryKey.reviewNo
                review.userId = element.userId
                this.reviewTable.push(review)
              }
            })
          })
        })
      }
    });
    return this.reviewTable
  }

  setHasProductCart(data) {
    this.hasProductCart.next(data ? data : this.defaultMsg)
  }
  getHasProductCart(): Observable<string>  {
    return this.hasProductCart.asObservable()
  }
}
