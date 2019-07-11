import { Component, OnInit, ViewChild } from '@angular/core';
import * as Hammer from 'hammerjs'
import { MatSidenav } from '@angular/material/sidenav';
import { LoginDialogComponent } from './login-dialog/login-dialog';
import { MatDialog, MatSnackBar ,MatDialogRef} from '@angular/material';
import {SigupDialogComponent } from './signup-dialog/sigup-dialog.component';

import { UserService } from '../services/user.service';
import { UserinfoDialogComponent } from './userInfo-dialog/userinfo-dialog.component';
import { Router } from '@angular/router';
import { SharedService } from '../services/shared.service';
import { ProductCartService } from '../services/product-cart.service';
import { User } from '../shared/userModel';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  title: String = 'アジャイル開発実践ECサイト';
  username: String = 'ゲスト';
  Sidenav_isOpen = false;
  isLoggedIn = false;
  loggedInDate: '';
  public hasProductCart: Observable<string> = this.sharedService.getHasProductCart();

  @ViewChild('sidenav') sidenav: MatSidenav;

  constructor(
    public dialog: MatDialog,
    private userService: UserService,
    private router: Router,
    private sharedService: SharedService,
    private productCartService: ProductCartService,

  ) { }

  ngOnInit() {
    if(this.userService.getToken() != null){
      this.getInfo()
      this.isLoggedIn = true
    }

  }

  getInfo() {
    let userId: any
    this.userService.getUserLoginHistory().subscribe(result => {
      if(result != {}){
        userId = result.primaryKey.userId
        this.loggedInDate = result.primaryKey.loginDt
        this.productCartService.getProductCartInfoByUserID(userId).subscribe((res: any) => {
          let userModel = new User()
          if(res.length !== 0) {
            userModel.hasProductCart = '有'
          } else {
            userModel.hasProductCart = '無'
          }
          this.sharedService.setHasProductCart(userModel.hasProductCart)
          this.hasProductCart = this.sharedService.getHasProductCart()

        })
      }
    })
    this.userService.getUserInfo().subscribe(res => {
      if(res) {
        this.username = res.name
      }
    })

  }

  changeState() {
    this.Sidenav_isOpen = !this.Sidenav_isOpen;

  }

  openDialog(): void {
    const dialogRef = this.dialog.open(LoginDialogComponent, {
      width: '750px',
      height: '500px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(result => {

      if(result){
        this.ngOnInit()

      }
    });
  }

  openDialogSigup():void {
    const dialogRef = this.dialog.open(SigupDialogComponent, {
      width: '650px',
      height: '450px',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        const dialogUserinfoDialog = this.dialog.open(UserinfoDialogComponent, {
          width: '650px',
          height: '830px',
          disableClose: true,
          data: result,
        });
        dialogUserinfoDialog.afterClosed().subscribe(res => {
          this.ngOnInit()
        })
      }
    });
  }

  logOut() {
    this.userService.logOut()
    this.router.navigate(['/home'])
    this.username = 'ゲスト';
    this.isLoggedIn = false;
    localStorage.clear()
  }

}
