import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatDialogRef, MatSidenavModule, MatListModule } from '@angular/material'

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
// import { LoginComponent } from './login/login.component';
import { LoginDialogComponent } from './home/login-dialog/login-dialog';
import { HttpClientModule, HttpHeaders } from '@angular/common/http';
import { SigupDialogComponent } from './home/signup-dialog/sigup-dialog.component';

import { UserinfoDialogComponent } from './home/userInfo-dialog/userinfo-dialog.component';
import { UserinfoComponent } from './home/userinfo/userinfo.component';
import { httpInterceptorProviders } from './interceptors';
import { ChangeDialogComponent } from './home/changePassword-dialog/change-dialog.component';
import { MypageComponent } from './home/mypage/mypage/mypage.component';
import { UserInfoUpdateDialogComponent } from './home/update/user-info-update-dialog/user-info-update-dialog.component';
import { ShippingAddressDialogComponent } from './home/shipping-address-dialog/shipping-address-dialog.component';
import { SignupPaymentmethodDialogComponent } from './home/signup-paymentmethod-dialog/signup-paymentmethod-dialog.component';
import { UpdatePaymentmethodDialogComponent } from './home/update/update-paymentmethod-dialog/update-paymentmethod-dialog.component';
import { ShippingAddressUpdateDialogComponent } from './home/update/shipping-address-update-dialog/shipping-address-update-dialog.component';
import { ConfirmDialogComponent } from './shared/confirm-dialog/confirm-dialog.component';
import { ProductDetailComponent } from './home/product/product-detail/product-detail.component';
import { SearchProductComponent } from './home/search-product/search-product.component';
import { ProductCartComponent } from './home/product-cart/product-cart.component';
import { ProductCartUpdateDialogComponent } from './home/update/product-cart-update-dialog/product-cart-update-dialog.component';
import { ProductCartBuyDialogComponent } from './home/product-cart-buy-dialog/product-cart-buy-dialog.component';
import { PurchaseHistoryComponent } from './home/purchase-history/purchase-history.component';
import { CancelOrderDialogComponent } from './home/purchase-history/cancel-order-dialog/cancel-order-dialog.component';
import { ReviewInfoDialogComponent } from './home/purchase-history/review-info-dialog/review-info-dialog.component';
import { RegistryReviewInfoDialogComponent } from './home/purchase-history/review-info-dialog/registry-review-info-dialog/registry-review-info-dialog.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,

    LoginDialogComponent,
    SigupDialogComponent,
    ChangeDialogComponent,
    UserinfoDialogComponent,
    UserinfoComponent,
    MypageComponent,
    UserInfoUpdateDialogComponent,
    ShippingAddressDialogComponent,
    SignupPaymentmethodDialogComponent,
    UpdatePaymentmethodDialogComponent,
    ShippingAddressUpdateDialogComponent,
    ConfirmDialogComponent,
    ProductDetailComponent,
    SearchProductComponent,
    ProductCartComponent,
    ProductCartUpdateDialogComponent,
    ProductCartBuyDialogComponent,
    PurchaseHistoryComponent,
    CancelOrderDialogComponent,
    ReviewInfoDialogComponent,
    RegistryReviewInfoDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    HttpClientModule,

  ],
  entryComponents: [
    LoginDialogComponent,
    SigupDialogComponent,
    ChangeDialogComponent,
    UserinfoDialogComponent,
    UserInfoUpdateDialogComponent,
    ShippingAddressDialogComponent,
    SignupPaymentmethodDialogComponent,
    UpdatePaymentmethodDialogComponent,
    ShippingAddressUpdateDialogComponent,
    ConfirmDialogComponent,
    ProductCartUpdateDialogComponent,
    ProductCartBuyDialogComponent,
    CancelOrderDialogComponent,
    ReviewInfoDialogComponent,
    RegistryReviewInfoDialogComponent,
  ],
  providers: [{ provide: MatDialogRef, useValue: {} }, httpInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
