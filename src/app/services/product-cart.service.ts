import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { ReplaySubject, of, Observable } from 'rxjs'
import { map, tap, catchError } from 'rxjs/operators'
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductCartService {

  public api = environment.apiUrl;
  private headers: any = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
  constructor(
    private http: HttpClient,
  ) { }

  private extractData(res: Response) {
    let body = res;
    return body || { };
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  getProductCartInfoByUserID(userId){
    return this.http.get(this.api+`productcart/getProductCartInfoByUserID/`+userId).pipe(map(this.extractData));
  }

  deleteProductCart(productCartId)
  {
    return this.http.delete(this.api+`productcart/deleteProductCart/`+productCartId).pipe(map(this.extractData));
  }
  getProductCartInfoByKey(productCartId){
    return this.http.get(this.api+`productcart/getProductCartInfoByKey/`+productCartId).pipe(map(this.extractData));
  }
  updateProductCart(productCart : any)
  {
    let data ={
        "productCartId":productCart.product_cart_id,
        "productId" : productCart.product_id,
        "userId":productCart.user_id,
        "size" : productCart.size,
        "color":productCart.color,
        "quantity":productCart.quantity,
        "cartRegistDt":productCart.cart_regist_dt
     }
    return this.http.put<any>(`${this.api}productcart/updateProductCart`, data, this.headers).pipe(
      tap(),
      catchError(this.handleError<any>('updateProductCart')));
  }

  insertNewProductCart(productDetail, userId) {
    let data = {
      userId: userId,
      productId: productDetail.productId,
      quantity: productDetail.quantity,
      size: productDetail.size,
      color: productDetail.color,
    }
    return this.http.post<any>(`${this.api}productcart/insertNewProductCart`, data, this.headers).pipe(
      tap(),
      catchError(this.handleError<any>('insertNewProductCart'))
    );
  }

 
}
