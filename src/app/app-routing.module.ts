import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { UserinfoComponent } from './home/userinfo/userinfo.component';
import { SearchProductComponent } from './home/search-product/search-product.component';
import { MypageComponent } from './home/mypage/mypage/mypage.component';
import { ProductCartComponent } from './home/product-cart/product-cart.component';
import { AuthGuard } from './auth/auth.guard';
import { ProductDetailComponent } from './home/product/product-detail/product-detail.component';
import { PurchaseHistoryComponent } from './home/purchase-history/purchase-history.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children:[
      {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        component: MypageComponent,
      },
      {
        path: 'search',
        component: SearchProductComponent,
      },
      {
        path:'product',
        children: [
          {
            path: 'detail/:product_id',
            component:ProductDetailComponent,
          }
        ],
      },
      {
        path:'product-cart',component:ProductCartComponent,
        canActivate: [AuthGuard],
      },
      {
        path:'info',component:UserinfoComponent,
        canActivate: [AuthGuard],
      },
      {
        path:'purchase-history',
        component:PurchaseHistoryComponent,
        canActivate: [AuthGuard],
      },
      {
        path:'**', redirectTo: '/home',
      },
    ]
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    useHash: true, 
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
