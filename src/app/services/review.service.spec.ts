import { TestBed } from '@angular/core/testing';

import { ReviewService } from './review.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { defer } from 'rxjs/internal/observable/defer';

describe('ReviewService', () => {
  let service: ReviewService;
  let httpClientSpyGet: { get: jasmine.Spy };
  let httpClientSpyPost: { post: jasmine.Spy };
  let httpClientSpyPut: { put : jasmine.Spy };
  let httpClientSpyDelete: { delete : jasmine.Spy };
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule,HttpClientTestingModule],
      providers: [ReviewService],
    })
    httpClientSpyGet = jasmine.createSpyObj('HttpClient', ['get']);
    httpClientSpyPost = jasmine.createSpyObj('HttpClient', ['post']);
    httpClientSpyPut = jasmine.createSpyObj('HttpClient', ['put']);
    httpClientSpyDelete = jasmine.createSpyObj('HttpClient', ['delete']);
  });

  it('should be created', () => {
    const service: ReviewService = TestBed.get(ReviewService);
    expect(service).toBeTruthy();
  });

  it('Get Review Of Product SUCCESS', () => {
      service = new ReviewService(<any>httpClientSpyGet);
      
      const listreview : any[] = [
        {
        product_id: 'TEST0001',
        evaluation: '5',
        reviewContent: 'よいよい！！！早めに買いて',
        reviewNo: '1',
        userId: 'testuser',
        review_dt : '2019-05-01 12:20:02'
      },
      {
        product_id: 'TEST0001',
        evaluation: '4',
        reviewContent: 'よいよい！！！早めに買いて',
        reviewNo: '1',
        userId: 'testuser2',
        review_dt : '2019-05-02 12:20:02'
      }
    ]

    httpClientSpyGet.get.and.returnValue(asyncData(listreview));
    expect(service.getReviewOfProduct).toBeTruthy();
    service.getReviewOfProduct('TEST0001').subscribe(
      (list : any[]) => {
        expect(list).toEqual(listreview);
        expect(list.length).toEqual(2);
      }
    );
  });

  it('Get Last Review Info By Product ID SUCCESS', () => {

    service = new ReviewService(<any>httpClientSpyGet);

    const review :any = {
      product_id: 'TEST0001',
      evaluation: '4',
      reviewContent: 'よいよい！！！早めに買いて',
      reviewNo: '1',
      userId: 'testuser2',
      review_dt : '2019-05-02'
    }

    httpClientSpyGet.get.and.returnValue(asyncData(review));
    expect(service.getLastReviewInfoByProductID).toBeTruthy();
    service.getLastReviewInfoByProductID('TEST0001').subscribe(
      (result : any) => {
        expect(result).toEqual(review);
      }
    );
  });
    
  it('Insert New Review Info SUCCESS', () => {
    service = new ReviewService(<any>httpClientSpyPost);

    const review : any = {
      product_id: 'TEST0001',
      evaluation: '4',
      review_ontent: 'よいよい！！！早めに買いて',
      userId: 'testuser2',
    }

    httpClientSpyPost.post.and.returnValue(asyncData(review));
    expect(service.insertNewReviewInfo).toBeTruthy();
    service.insertNewReviewInfo(review, review.product_id).subscribe(
      (result : any) => {
        expect(result).toEqual(review);
      }
    );
  });

  it('Delete Review SUCCESS', () => {
      service = new ReviewService(<any>httpClientSpyDelete)

      const productId = 'TEST0001';
      const reviewNo = '1';
      const status = {
        200 : 'OK'
      }

      httpClientSpyDelete.delete.and.returnValue(asyncData(status));
      expect(service.deleteReview).toBeTruthy();
      service.deleteReview(productId,reviewNo).subscribe(
        (result : any) => {
          expect(result).toEqual(status);
        }
      );
  });

  it('Update Review Info SUCCESS', () => {

     service = new ReviewService(<any>httpClientSpyPut);

     const review : any = {
      product_id: 'TEST0001',
      reviewNo : '1',
      evaluation: '4',
      review_ontent: 'よいよい！！！早めに買いて',
      userId: 'testuser2',
    }
      
      httpClientSpyPut.put.and.returnValue(asyncData(review));
      expect(service.updateReviewInfo).toBeTruthy();
      service.updateReviewInfo(review,review.productId).subscribe(
        (result : any) => {
          expect(result).toEqual(review);
        }
      );
  });

});

export function asyncData<T>(data: T) {
  return defer(() => Promise.resolve(data));
}
