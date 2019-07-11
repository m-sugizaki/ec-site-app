import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-search-product',
  templateUrl: './search-product.component.html',
  styleUrls: ['./search-product.component.scss'],
  providers: [DecimalPipe]
})
export class SearchProductComponent implements OnInit {

  product: any = {
    name: '',
    maker: '',
    fromprice: null,
    toprice : null
  }
  frompriceold
  topriceold
  products
  message = ''
  messagePrice
  constructor(
    private router: Router,
    private productService: ProductService,
    private decimal: DecimalPipe
  ) { }

  ngOnInit() {
  }
  searchProductData() {
    this.messagePrice= ''
    if(this.product.fromprice>=this.product.toprice && this.product.toprice!=null)
    {
      this.messagePrice= ' 価格Fromの値は価格Toより大きいです。再入力してください。';
      this.products=[];
      return;
    }
    this.productService.searchProductData(this.product).subscribe(
      result => {
        this.message = '';
        this.products = result;
        if (result == '') {
          this.message = 'データがありません。';
        }
      });
  }

  goToProductDetail(e) {
    this.router.navigate(['/product/detail', e]);
  }


}
