import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { ReplaySubject, of, Observable } from 'rxjs'
import { map, tap, catchError } from 'rxjs/operators'
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class PurchaseResultsService {

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
  insertPurchaseResult(product_cart)
  {
      let data = {
        "quantity":product_cart.quantity,
        "size":product_cart.size,
        "color":product_cart.color,
        "shippingAddressNo":product_cart.shipping_address_no,
        "paymentNo":product_cart.payment_no,
        "userId" : product_cart.user_id,
        "productId":product_cart.product_id,
        "orderStatus":"注文確定",
        "orderNo":"",
        "paymentMethod":product_cart.payment_method,
        "deliveryPlanDt":"",
        "deliveryCompletionDt":""
      }
      return this.http.post<any>(`${this.api}purchaseresults/insertPurchaseResult`, data, this.headers).pipe(
        tap(),
        catchError(this.handleError<any>('insertPurchaseResult'))
      );
  }

  getPurchaseResultsInfoByUserIDList(userIdlst) {
    return this.http.get(this.api + `purchaseresults/getPurchaseResultsInfoByUserIDList/${userIdlst}`).pipe(map(this.extractData));
  }

  updatePurchaseResult(orderInfo) {
    return this.http.put<any>(`${this.api}purchaseresults/updatePurchaseResultStatus`, orderInfo, this.headers).pipe(
      tap(),
      catchError(this.handleError<any>('updatePurchaseResultStatus'))
    );
  }
}
