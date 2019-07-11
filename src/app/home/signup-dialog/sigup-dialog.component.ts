import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material'
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { SharedService } from '../../services/shared.service';



@Component({
  selector: 'app-sigup-dialog',
  templateUrl: './sigup-dialog.component.html',
  styleUrls: ['./sigup-dialog.component.scss'],
  providers:[UserService],
})
export class SigupDialogComponent implements OnInit {

  message
  success
  user: any = {
    user_id: '',
    password: '',
    confirmPassword: '',
    loginDate: '',
    hasProductCart: false,
    isValidLogin: false,
  }

  constructor(
    private router: Router,
    public dialogRef: MatDialogRef<SigupDialogComponent>,
    private userService: UserService,
    private sharedService: SharedService

  ) { }

  ngOnInit() {
  }

  SignUp(){
      this.message='';
      this.success='';
      if(this.user.user_id==='')
      {
        this.message = 'ユーザーIDの値を入力してください。'
        return
      }
      if(this.user.password==='')
      {
        this.message = 'パスワード の値を入力してください。'
        return
      }
      if(this.user.password !== this.user.confirmPassword)
      {
        this.message = 'パスワード (確認) の値を入力してください。'
        return
      }
      this.userService.insertNewAccount(this.user.user_id,this.user.password).subscribe(
          (data)=>{
            if(data==null)
            {
              this.message = 'ユーザIDが存在しています。再入力してください。';
              return
            }
            else
            {
              this.userService.insertLoginHistory(this.user.user_id).subscribe(
                (data)=>{
                    if(data==null)
                    {
                      this.message = 'ユーザIDが存在しています。再入力してください。';
                        return
                    }
                    else{
                          this.success="新規ユーザIDとパスワードが成功に登録されました。"
                          this.user.user_id = data.primaryKey.userId;
                          this.user.loginDate=data.primaryKey.loginDt;
                          this.user.isValidLogin=true;
                          this.dialogRef.close(this.user);
                          return
                    }
                },
                (err)=>{}

              )

            }
          },
          (err)=>{

          }
      );

  }
  onNoClick(): void {

    this.dialogRef.close(false);
  }

}
