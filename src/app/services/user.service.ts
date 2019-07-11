import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Router } from '@angular/router'

import { ReplaySubject, of, Observable } from 'rxjs'
import { map, tap, catchError } from 'rxjs/operators'
import { environment } from 'src/environments/environment';
import { LoginHistory } from '../home/loginHistory';
import { UserStore,UserStorePK } from '../home/userStore';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public api = environment.apiUrl;
  private token: string = null;
  private userInstance = null;
  private userSrc = new ReplaySubject<any>(null);
  readonly user = this.userSrc.asObservable();
  private headers: any = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
  private loggedInStatus = JSON.parse(localStorage.getItem('loggedIn') || 'false');
  constructor(
    private router: Router,
    private http: HttpClient,
  ) { }

  getToken() {
    return this.token || (this.token = localStorage.getItem('token'))
  }

  setToken(token) {
    this.token = token
    localStorage.setItem('token', token)
  }

  removeToken() {
    this.token = null
    localStorage.removeItem('token')
  }
  setUser(user) {
    this.userSrc.next({ ...user })
    this.userInstance = { ...user }
  }

  getUserInstance() {
    return this.userInstance
  }

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

  login(userId, password) {
    let primaryKey = {
      userId
    }
    return this.http
      .post<any>(`${this.api}/user/login`,{ primaryKey, password }, this.headers)
      .pipe(
        map((res: any) => {
          if (res[0].userId) {
            this.setToken(res[0].token)
            this.setUser(res[0].userId)
          }
          return res
        })
      )
  }

  isLoggedIn() {
    if (!!this.userInstance) {
      return of(this.userInstance)
    }
    // dung ham nay de han che truy xuat localstorage de tang performance
    const token = this.getToken()
    // neu chua cho token thi chac chan chua dang nhap
    if (!token) {
      this.logOut()
      return of(null)
    }
    return this.http
      .post<any>(`${this.api}user/verifyToken/`, token, this.headers)
      .pipe(
        tap(
          // Log the result or error
          (res: any) => {
            if (!res) {
              return this.logOut()
            }
            this.setToken(token)
            this.setUser(res[0])
          },
          (error) => {
            this.logOut()
            location.reload()
          }
        ),
        map((res: any) => {
          return this.userInstance
        })
      )
  }

  logOut() {
    sessionStorage.removeItem('username')
    this.removeToken()
    this.userInstance = null

  }

  insertLoginHistory (userId:String): Observable<any>{
    let primaryKey = {
      "primaryKey":{"userId": userId,
      "loginDt": new Date()}
    }
    return this.http.post<any>(`${this.api}/user/insertLoginHistory`, primaryKey, this.headers).pipe(
      catchError(this.handleError<any>('insertLoginHistory'))
    );
  }

  insertNewAccount (userId:String,password:String): Observable<any> {
    let data = {
      "primaryKey": {"userId":userId},
      "password": password
    }

    return this.http.post<any>(`${this.api}user/insertNewAccount`, data, this.headers).pipe(
      tap(),
      catchError(this.handleError<any>('insertNewAccount'))
    );
  }

  getUserLoginHistory(): Observable<any> {

    return this.http.get(this.api + `/user/getUserLastLoginHistory/` + this.getToken()).pipe(
      map(this.extractData));
  }

  getUserInfo():Observable<any>{
    return this.http.get(this.api+`user/`+this.getToken()).pipe(map(this.extractData));
  }

  checkUser(userId:String,password:String){
    let primaryKey = {
      "primaryKey":{"userId":userId},"password":password
    }
    return this.http
      .post<any>(`${this.api}/user/checkAccount/`, primaryKey, this.headers)
      .pipe(
        map((res: any) => {
          // if (res.data) {
          //   this.setToken(res.data.token)
          //   this.setUser(res.data.user)
          // }
          return res
        })
      )
  }

  hasPaymentMethod(userId: any) {
    return this.http.get(this.api + `/user/hasPaymentMethod/` + userId).pipe(
      map(this.extractData));
  }

  updateUser(userId:String,password:String):Observable<any>{
    let primarykey={
      "primaryKey":{"userId":userId},"password":password
    }
    return this.http.put(`${this.api}/user/updateAccount/`, primarykey, this.headers).pipe(
      tap( ),
      catchError(this.handleError<any>('UpdateUser'))
    );

  }
  insertNewUserInfo(user:any):Observable<any>
  {
    let data = {
      "primaryKey":{"userId":user.user_id},
      "name" : user.name,
      "nickname":user.nickname,
      "postalCode" : user.postalCode,
      "address1":user.address1,
      "address2":user.address2,
      "phoneNumber":user.phoneNumber,
      "email":user.email,
      "birthday":user.birthday,
      "memberRank":user.memberRank
    }
    return this.http.post<any>(`${this.api}user/insertNewUserInfo`, data, this.headers).pipe(
      tap(),
      catchError(this.handleError<any>('insertNewUserInfo'))
    );

  }
  updateUserInfo(user:any)
  {
    let data = {
      "primaryKey":{"userId":user.user_id},
      "name" : user.name,
      "nickname":user.nickname,
      "postalCode" : user.postal_code,
      "address1":user.address1,
      "address2":user.address2,
      "phoneNumber":user.phone_number,
      "email":user.email,
      "birthday":user.birthday,
      "memberRank":user.member_rank
    }

    return this.http.put<any>(`${this.api}user/updateUserInfo`, data, this.headers).pipe(
      tap(),
      catchError(this.handleError<any>('updateUserInfo')));
    }

    goHome() {
      this.router.navigate(['/home'])
    }

    getUserInfoByUserIdList(userIdList):Observable<any> {
      return this.http.get(this.api+`user/getUserInfoByUserIdList/`+ userIdList).pipe(map(this.extractData));
    }

}
