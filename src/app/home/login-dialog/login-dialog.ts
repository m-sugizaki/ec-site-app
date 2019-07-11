import { Component, Inject } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA ,MatDialog, MatSnackBar} from '@angular/material'

import { Router } from '@angular/router';
import { LoginHistory } from '../loginHistory';
import {SigupDialogComponent } from '../signup-dialog/sigup-dialog.component';
import {ChangeDialogComponent } from '../changePassword-dialog/change-dialog.component';
import { UserService } from '../../services/user.service';



import { SharedService } from '../../services/shared.service';
import { UserinfoDialogComponent } from '../userInfo-dialog/userinfo-dialog.component';

@Component({
  selector: 'login-dialog',
  templateUrl: 'login-dialog.html',
  styleUrls: ['login-dialog.css'],
  providers: [UserService],
})
export class LoginDialogComponent {

  message
  user: any = {
    user_id: '',
    password: '',
    // invalidLogin: false,
    // loggedInDate: '',
    // hasProduct: false,
  }
  userDetail: any = {
    user_id: '',
    loginDate: '',
    isLoggedIn: false,
    hasProductCart: false,
  }
  constructor(
    private router: Router,
    public dialogRef: MatDialogRef<LoginDialogComponent>,
    public dialog: MatDialog,
    private userService: UserService,
    private sharedService: SharedService,
  ) { }

  ngOnInit() {
    document.getElementById('password').addEventListener(
      'keyup',
      function (event) {
        event.preventDefault()
        if (event.keyCode === 13) this.userService.login()
      }.bind(this)
    )
  }

  onNoClick(): void {

    this.dialogRef.close(false);
  }
  SignIn() {
    if (this.user.user_id === '') {
      //this.message = common.message.W010({ param: 'ユーザーID' })
      this.message = 'ユーザーID の値を入力してください。'
      return
    }
    if (this.user.password === '') {
      //this.message = common.message.W010({ param: 'パスワード' })
      this.message = 'パスワード の値を入力してください。'
      return
    }
    this.userService
      .login(this.user.user_id, this.user.password)
      .subscribe(
        (result) => {
          if (result) {
            this.message = '';
            this.userDetail.isLoggedIn =  true;
            this.getUserDetail()
            this.dialogRef.close(this.userDetail);
            this.sharedService.openSnackBar("成功にログインしました。", "Login")
            this.userService.insertLoginHistory(this.user.user_id).subscribe((res) => { });
          }
          else{
            this.message = 'ユーザIDまたはパスワードが間違っています。再入力してください。'
            return
          }
        },
        (err) => {
          this.user.password = ''
          this.message =
            err == 3 ||
            (err == false && `ユーザIDまたはパスワードが間違っています。再入力してください。`) ||
            (err == 6 && `ユーザIDまたはパスワードが間違っています。再入力してください。`) ||
            `ユーザIDまたはパスワードが間違っています。再入力してください。`
            // `ログインが失敗しました。システム担当へ連絡してください。`
        }
      )
  }

  getUserDetail() {
    this.userService.getUserLoginHistory().subscribe((data) => {

      this.userDetail.user_id = data.primaryKey.userId;
      this.userDetail.loginDate = data.primaryKey.loginDt;

    });
  }

  openDialogSigup():void {
    this.dialogRef.close();
    const dialogRef = this.dialog.open(SigupDialogComponent, {
      width: '650px',
      height: '450px',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        const dialogUserInfo = this.dialog.open(UserinfoDialogComponent, {
          width: '650px',
          height: '830px',
          disableClose: true,
          data: result,
        });
        dialogUserInfo.afterClosed().subscribe(res => {
          if(this.userService.getToken() != null){
            location.reload()
          }

        })
      }
    });
  }

  openDialogChange():void{
    //this.dialogRef.close();

    const dialog = this.dialog.open(ChangeDialogComponent, {
      width: '650px',
      height: '550px',
      disableClose: true,
    });
    dialog.afterClosed().subscribe(result=>
      {
        if(result){
          this.dialogRef.close(result);
        }
      });

  }

}
