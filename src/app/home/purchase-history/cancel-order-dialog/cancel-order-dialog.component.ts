import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { SharedService } from 'src/app/services/shared.service';
import { Router } from '@angular/router';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { PurchaseResultsService } from 'src/app/services/purchase-results.service';

@Component({
  selector: 'app-cancel-order-dialog',
  templateUrl: './cancel-order-dialog.component.html',
  styleUrls: ['./cancel-order-dialog.component.scss']
})
export class CancelOrderDialogComponent implements OnInit {

  order_info: any
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sharedService: SharedService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<CancelOrderDialogComponent>,
    private router: Router,
    private purchaseResultService: PurchaseResultsService,
  ) { }

  ngOnInit() {
    this.order_info = this.data
  }

  confirm() {
    const dialogConfirm = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      height: '200px',
      disableClose: true,
      data: '取消'
    });
    dialogConfirm.beforeClosed().subscribe(res => {
      if(res) {
        this.order_info.orderStatus = '注文キャンセル'
        this.purchaseResultService.updatePurchaseResult(this.order_info).subscribe(res => {
          this.sharedService.openSnackBar("取消が成功にされました。","")
          this.dialogRef.close(true);
        })
      }
    },
    err => {
      this.sharedService.openSnackBar("取消できませんでした。","")
    })
  }

  cancel() {
    this.dialogRef.close(false);
  }
}
