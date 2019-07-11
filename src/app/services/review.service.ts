import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map, tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  public api = environment.apiUrl;
  private headers: any = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
  constructor(
    private http: HttpClient,
  ) { }

  private extractData(res: Response) {
    let body = res;
    return body || {};
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
  getReviewOfProduct(productId): Observable<any> {
    return this.http.get(this.api + `review/getReviewOfProduct/` + productId).pipe(map(this.extractData));
  }

  getLastReviewInfoByProductID(productIdLst) {
    return this.http.get(this.api + `review/getLastReviewInfoByProductID/${productIdLst}`).pipe(map(this.extractData));
  }

  insertNewReviewInfo(reviewInfo, productId) {
    let data = {
      primaryKey:{"productId": productId},
      "evaluation": reviewInfo.evaluation,
      "reviewContent": reviewInfo.review_content,
      "userId": reviewInfo.userId,
    }
    return this.http.post<any>(`${this.api}review/insertNewReviewInfo`, data, this.headers).pipe(
      tap(),
      catchError(this.handleError<any>('insertNewReviewInfo'))
    );
  }

  deleteReview(productId, reviewNo) {
    return this.http.delete(this.api+`review/deleteReview/${productId}/${reviewNo}`).pipe(map(this.extractData));
  }

  updateReviewInfo(reviewInfo, productId) {
    let data = {
      primaryKey:{"productId": productId, "reviewNo": reviewInfo.reviewNo},
      "evaluation": reviewInfo.evaluation,
      "reviewContent": reviewInfo.review_content
    }
    return this.http.put<any>(`${this.api}review/updateReviewInfo`, data, this.headers).pipe(
      tap(),
      catchError(this.handleError<any>('updateReviewInfo'))
    );
  }
}
