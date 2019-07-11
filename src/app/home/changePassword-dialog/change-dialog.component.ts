import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material'

import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { SharedService } from 'src/app/services/shared.service';



@Component({
  selector: 'app-change-dialog',
  templateUrl: './change-dialog.component.html',
  styleUrls: ['./change-dialog.component.scss']
})
export class ChangeDialogComponent implements OnInit {

  message
  success
  user: any = {
    user_id: '',
    password: '',
    new_password: "",
    confirm_password: '',

  }
  userDetail: any = {
    user_id: '',
    loginDate: '',
    isLoggedIn: true,
    hasProductCart: false,
  }

  constructor(
    private router: Router,
    public dialogRef: MatDialogRef<ChangeDialogComponent>,
    private userService: UserService,
    private sharedService: SharedService,
  ) { }

  ngOnInit() {
  }

  Change(){
      this.message="";
      this.success="";
      if(this.user.user_id==='')
      {
        this.message = "ユーザID の値を入力してください。";
        return
      }
      if(this.user.password==='')
      {
        this.message = "現在のパスワード の値を入力してください。";
        return
      }
      if(this.user.new_password==='')
      {
        this.message = "新しいパスワードの値を入力してください。";
        return
      }
      if(this.user.confirm_password==='')
      {
        this.message = "新しいパスワード (確認) の値を入力してください。";
        return
      }
      if(this.user.new_password!=this.user.confirm_password)
      {
        this.message="新しいパスワードと新しいパスワード(確認)の値が不一致です。再入力してください。";
        return
      }
      this.userService.checkUser(this.user.user_id,this.user.password).subscribe(
        (result)=>{

          if(result)
          {
              this.userService.updateUser(this.user.user_id,this.user.new_password).subscribe(
                (data)=>{
                  if(data==null)
                  {
                    this.sharedService.openSnackBar("Failed to Update", "Failed")
                  }
                  else
                  {
                    this.userService.insertLoginHistory(this.user.user_id).subscribe(
                      (data)=>{
                        if(data==null)
                        {

                        }
                        else
                        {
                          this.success="パスワードが成功に更新されました。";
                          this.sharedService.openSnackBar(this.success, "Success")
                          this.userService.login(this.user.user_id, this.user.new_password).subscribe(res =>{
                            if(res) {
                              //this.router.navigate(['/home'])
                              this.dialogRef.close(true)
                            }
                          })
                        }
                      }
                    )
                  }
                }
              )
          }
          else{
            this.message='ユーザIDが存在していません。';
          }

        }
      );


  }

  getUserDetail(userId: String) {
    this.userService.getUserInfo().subscribe((data) => {
    this.userDetail.user_id = data.primaryKey.userId;
    this.userDetail.loginDate = data.primaryKey.loginDt;
    });
  }
  onNoClick(): void {

    this.dialogRef.close(false);
  }

}
