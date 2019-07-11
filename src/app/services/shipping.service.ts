import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Router } from '@angular/router'

import { ReplaySubject, of, Observable } from 'rxjs'
import { map, tap, catchError } from 'rxjs/operators'
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ShippingService {


  public api = environment.apiUrl;
  private headers: any = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
  constructor(
    private router: Router,
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
  getShippingAddressByUserID(userId:String){
    return this.http.get(this.api+`shippingaddress/getShippingAddressInfoByUserID/`+userId).pipe(map(this.extractData));
  }
  insertNewShippingAddress(shippingAddress:any):Observable<any>
  {
      let data ={
          "primaryKey":{"shippingAddressNo":shippingAddress.shipping_address_no,"userId" : shippingAddress.user_id},
          "postalCode":shippingAddress.postal_code,
          "address1":shippingAddress.address1,
          "address2":shippingAddress.address2,
          "phoneNumber":shippingAddress.phone_number,
          "shippingAddressName":shippingAddress.shipping_address_name
      }
      return this.http.post<any>(`${this.api}shippingaddress/insertNewShippingAddress`, data, this.headers).pipe(
        tap(),
        catchError(this.handleError<any>('insertNewShippingAddress'))
      );
  }
  getShippingAddressInfo(userId:String,shipping_address_no):Observable<any>
  {
    return this.http.get(this.api+`shippingaddress/getShippingAddressInfoByKey/`+userId+`/`+shipping_address_no).pipe(map(this.extractData));
  }
  updateShippingAddress(shippingAddress:any)
  {
    let data ={
      "primaryKey":{"shippingAddressNo":shippingAddress.shipping_address_no,"userId" : shippingAddress.user_id},
      "postalCode":shippingAddress.postal_code,
      "address1":shippingAddress.address1,
      "address2":shippingAddress.address2,
      "phoneNumber":shippingAddress.phone_number,
      "shippingAddressName":shippingAddress.shipping_address_name
     }
    return this.http.put<any>(`${this.api}shippingaddress/updateShippingAddress`, data, this.headers).pipe(
      tap(),
      catchError(this.handleError<any>('updateUserInfo')));

  }
  deleteShippingAddress(userId:String,shipping_address_no)
  {
      return this.http.delete(this.api+`shippingaddress/deleteShippingAddress/`+userId+`/`+shipping_address_no).pipe(map(this.extractData));
  }

}
