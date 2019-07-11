import { TestBed } from '@angular/core/testing';

import { SharedService } from './shared.service';
import { MatSnackBar } from '@angular/material';
import { ReviewService } from './review.service';
import { UserService } from './user.service';
import { LoginDialogComponent } from '../home/login-dialog/login-dialog';

describe('SharedService', () => {
  let sharedService: SharedService
  let snackBar: MatSnackBar;
  let reviewService: ReviewService;
  let userService: UserService;
  let loginDialogComponent: LoginDialogComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({});

  });

  it('Get review of product_Should have data', () => {
    sharedService = new SharedService(snackBar, reviewService, userService)
    let data = {
      nickname: "tester7",
      evaluation: "5",
      productId: "test10001",
      reviewContent: "abcd",
      reviewDt: new Date(2019, 5, 15, 10, 5, 10),
      reviewNo: "1",
      userId: "testuser7"
    }

    spyOn(sharedService, 'getReviewOfProduct').and.returnValue(data)
    expect(sharedService.getReviewOfProduct).toBeTruthy()
    expect(sharedService.getReviewOfProduct("test10001").length).not.toEqual(0)
  });

  it('should be created', () => {
    sharedService = new SharedService(snackBar, reviewService, userService)
    expect(sharedService).toBeTruthy();
  });
});
