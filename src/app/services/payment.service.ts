import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'

import { ReplaySubject, of, Observable } from 'rxjs'
import { map, tap, catchError } from 'rxjs/operators'
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

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
  getPaymentMethodByUserID(userId:String){
    return this.http.get(this.api+`paymentmethod/getPaymentMethodInfoByUserID/`+userId).pipe(map(this.extractData));
  }

  getMaxPaymentMethodNoOfUser(userId:String){
    return this.http.get(this.api+`paymentmethod/getMaxPaymentMethodNoOfUser/`+userId).pipe(map(this.extractData));
  }

  insertNewPaymentMethod(paymentInfo: any): Observable<any>  {

    let data = {
      "primaryKey":{ "userId": paymentInfo.user_id },
      "paymentMethod": paymentInfo.payment_method,
      "cardNumber": paymentInfo.card_number,
      "expirationDate": paymentInfo.expiration_date,
      "cardHolderName": paymentInfo.owner_name,
    }
    return this.http.post<any>(`${this.api}paymentmethod/insertNewPaymentMethod`, data, this.headers).pipe(
      tap(),
      catchError(this.handleError<any>('insertNewPaymentMethod'))
    );
  }

  deletePaymentMethod(userId, paymentNo) {
        return this.http.delete<any>(`${this.api}paymentmethod/deletePaymentMethod/${userId}/${paymentNo}`, this.headers).pipe(
          tap(),
          catchError(this.handleError<any>('deletePaymentMethod'))
        );
    }

    updatePaymentMethod(paymentInfo: any) {
      return this.http.put<any>(`${this.api}paymentmethod/updatePaymentMethod`, paymentInfo, this.headers).pipe(
        tap(),
        catchError(this.handleError<any>('updatePaymentMethod'))
      );
    }
}
