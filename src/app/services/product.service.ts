import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'

import { ReplaySubject, of, Observable } from 'rxjs'
import { map, tap, catchError } from 'rxjs/operators'
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

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
  searchProductData(product: any) {
    let data = {
      "productName": product.name,
      "maker": product.maker,
      "fromPrice": product.fromprice,
      "toPrice": product.toprice
    }
    return this.http.post<any>(`${this.api}product/searchProductData`, data, this.headers).pipe(
      tap(),
      catchError(this.handleError<any>('searchProductData'))
    );
  }

  getProductInfo(productId): Observable<any> {
    return this.http.get(this.api + `product/getProductInfoByKey/` + productId).pipe(map(this.extractData));
  }

  getProductInfoByProductIDList(productIdLst) {
    return this.http.get(this.api + `product/getProductInfoByProductIDList/${productIdLst}`).pipe(map(this.extractData));
  }

  insertNewProductCart(productDetail, quantity, userId) {
    let data = {
      userId: userId,
      productId: productDetail.primaryKey.productId,
      quantity: quantity,
      size: productDetail.size,
      color: productDetail.color,
    }

    return this.http.post<any>(`${this.api}productcart/insertNewProductCart`, data, this.headers).pipe(
      tap(),
      catchError(this.handleError<any>('insertNewProductCart'))
    );
  }
}
