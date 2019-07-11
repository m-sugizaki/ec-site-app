import { Component, OnInit,  } from '@angular/core';
import { UserService } from '../../services/user.service';
import { PaymentService } from '../../services/payment.service';
import { ShippingService } from '../../services/shipping.service';
import { MatDialog, MatSnackBar ,MatDialogRef} from '@angular/material';
import { UserInfoUpdateDialogComponent } from '../update/user-info-update-dialog/user-info-update-dialog.component';

import { Router } from '@angular/router';



@Component({
  selector: 'app-userinfo',
  templateUrl: './userinfo.component.html',
  styleUrls: ['./userinfo.component.scss']
})
export class UserinfoComponent implements OnInit {


  payments
  shippings
  user:any={
    user_id:'',
    name:'',
    nickname:'',
    postal_code:'',
    address1:'',
    address2:'',
    phone_number:'',
    email:'',
    birthday:'',
    member_rank:'',

}
  constructor(

    private router: Router,
    private userService: UserService,
    private paymentService: PaymentService,
    private shippingService : ShippingService,
    private dialog : MatDialog
  ) { }

  ngOnInit() {
    this.userService.getUserInfo().subscribe(
      result=>{
        this.user.user_id=result.primaryKey.userId;
        this.user.name = result.name;
        this.user.nickname=result.nickname;
        this.user.postal_code = result.postalCode;
        this.user.address1=result.address1;
        this.user.address2 = result.address2;
        this.user.phone_number = result.phoneNumber;
        this.user.email = result.email;
        this.user.birthday = result.birthday;
        this.user.member_rank = result.memberRank;
        this.paymentService.getPaymentMethodByUserID(this.user.user_id).subscribe(
          result=>{
            this.payments=result;
          }
      );
      this.shippingService.getShippingAddressByUserID(this.user.user_id).subscribe(
        result=>{
          this.shippings = result;
        }
      )
      }
    );

  }
  openDialogUserInfo()
  {
    const dialogRef = this.dialog.open(UserInfoUpdateDialogComponent, {
      width: '850px',
      height: '850px',
      disableClose: true,

    });
    dialogRef.afterClosed().subscribe(result => {

        this.ngOnInit();
    });
  }

}
