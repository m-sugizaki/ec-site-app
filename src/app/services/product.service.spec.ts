import { TestBed, async } from '@angular/core/testing';

import { ProductService } from './product.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { defer } from 'rxjs/internal/observable/defer';

describe('ProductService', () => {
  let httpClientSpyGet: { get: jasmine.Spy , post: jasmine.Spy };
  let httpClientSpyPost: { post: jasmine.Spy };
  let productService: ProductService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [ProductService, HttpTestingController],
    })
    httpClientSpyGet = jasmine.createSpyObj('HttpClient', ['get']);
    httpClientSpyPost = jasmine.createSpyObj('HttpClient', ['post']);

  });

  it('should be created', () => {
    const service: ProductService = TestBed.get(ProductService);
    expect(service).toBeTruthy();
  });

  it('Get product info by list product id SUCCESS ', () => {
    productService = new ProductService(<any>httpClientSpyGet)
    const listProduct: any[] =
      [
        {
          primaryKey: { product_id: 'TEST0001' },
          product_name: 'B4モバイルノート GSX400R',
          maker: 'PC工房',
          price: '10830.60',
          sale_point: '格安ハイスペックPC！ 普段使いにストレスを感じさせません！！！',
          stock_quantity: '99'
        },
        {
          primaryKey: { product_id: 'TEST0002' },
          product_name: 'B4モバイルノート GSX400R',
          maker: 'PC工房',
          price: '10830.60',
          sale_point: '格安ハイスペックPC！ 普段使いにストレスを感じさせません！！！',
          stock_quantity: '99'
        }

      ];

    httpClientSpyGet.get.and.returnValue(asyncData(listProduct));
    expect(productService.getProductInfoByProductIDList).toBeTruthy();
    productService.getProductInfoByProductIDList("TEST0001,TEST0002").subscribe(
      (list: any[]) => {
        expect(list).toEqual(listProduct);
        expect(list.length).toEqual(2);
      }
    );
  });

  it('Get product info  SUCCESS ', () => {
    productService = new ProductService(<any>httpClientSpyGet)
    const product: any =
     {
          primaryKey: { product_id: 'TEST0001' },
          product_name: 'B4モバイルノート GSX400R',
          maker: 'PC工房',
          price: '10830.60',
          sale_point: '格安ハイスペックPC！ 普段使いにストレスを感じさせません！！！',
          stock_quantity: '99'
      };

    httpClientSpyGet.get.and.returnValue(asyncData(product));
    expect(productService.getProductInfo).toBeTruthy();
    productService.getProductInfo("TEST0001").subscribe(
      (result: any) => {
        expect(result).toEqual(product);
      }
    );
  });

  it('Search product by name  SUCCESS ', () => {
    productService = new ProductService(<any>httpClientSpyPost)
    const listProduct: any[] =
      [
        {
          primaryKey: { product_id: 'TEST0001' },
          product_name: 'B4モバイルノート GSX400R',
          maker: 'PC工房',
          price: '10830.60',
          sale_point: '格安ハイスペックPC！ 普段使いにストレスを感じさせません！！！',
          stock_quantity: '99'
        },
        {
          primaryKey: { product_id: 'TEST0002' },
          product_name: 'B4モバイルノート GSX400R',
          maker: 'PC工房',
          price: '10830.60',
          sale_point: '格安ハイスペックPC！ 普段使いにストレスを感じさせません！！！',
          stock_quantity: '99'
        }

      ];
        
      let data = {
        "productName": 'B4モ',
        "maker": '',
        "fromPrice": '',
        "toPrice": ''
      }  

    httpClientSpyPost.post.and.returnValue(asyncData(listProduct));
    expect(productService.searchProductData).toBeTruthy();
    productService.searchProductData(data).subscribe(
      (list: any[]) => {
        expect(list).toEqual(listProduct);
        expect(list.length).toEqual(2);
      }
    );
  });

  it('Search product by maker  SUCCESS ', () => {
    productService = new ProductService(<any>httpClientSpyPost)
    const listProduct: any[] =
      [
        {
          primaryKey: { product_id: 'TEST0001' },
          product_name: 'B4モバイルノート GSX400R',
          maker: 'PC工房',
          price: '10830.60',
          sale_point: '格安ハイスペックPC！ 普段使いにストレスを感じさせません！！！',
          stock_quantity: '99'
        },
        {
          primaryKey: { product_id: 'TEST0002' },
          product_name: 'B4モバイルノート GSX400R',
          maker: 'PC工房',
          price: '10830.60',
          sale_point: '格安ハイスペックPC！ 普段使いにストレスを感じさせません！！！',
          stock_quantity: '99'
        }

      ];
        
      let data = {
        "productName": '',
        "maker": 'PC工房',
        "fromPrice": '',
        "toPrice": ''
      }  

    httpClientSpyPost.post.and.returnValue(asyncData(listProduct));
    expect(productService.searchProductData).toBeTruthy();
    productService.searchProductData(data).subscribe(
      (result: any[]) => {
        expect(result).toEqual(listProduct);
        expect(result.length).toEqual(2);
      }
    );
  });

  it('Search product by From Pricre  SUCCESS ', () => {
    productService = new ProductService(<any>httpClientSpyPost)
    const listProduct: any[] =
      [
        {
          primaryKey: { product_id: 'TEST0001' },
          product_name: 'B4モバイルノート GSX400R',
          maker: 'PC工房',
          price: '10830.60',
          sale_point: '格安ハイスペックPC！ 普段使いにストレスを感じさせません！！！',
          stock_quantity: '99'
        },
        {
          primaryKey: { product_id: 'TEST0002' },
          product_name: 'B4モバイルノート GSX400R',
          maker: 'PC工房',
          price: '10830.60',
          sale_point: '格安ハイスペックPC！ 普段使いにストレスを感じさせません！！！',
          stock_quantity: '99'
        }

      ];
        
      let data = {
        "productName": '',
        "maker": '',
        "fromPrice": '10830.60',
        "toPrice": ''
      }  

    httpClientSpyPost.post.and.returnValue(asyncData(listProduct));
    expect(productService.searchProductData).toBeTruthy();
    productService.searchProductData(data).subscribe(
      (result: any[]) => {
        expect(result).toEqual(listProduct);
        expect(result.length).toEqual(2);
      }
    );
  });

  it('Search product by To Price  SUCCESS ', () => {
    productService = new ProductService(<any>httpClientSpyPost)
    const listProduct: any[] =
      [
        {
          primaryKey: { product_id: 'TEST0001' },
          product_name: 'B4モバイルノート GSX400R',
          maker: 'PC工房',
          price: '10830.60',
          sale_point: '格安ハイスペックPC！ 普段使いにストレスを感じさせません！！！',
          stock_quantity: '99'
        },
        {
          primaryKey: { product_id: 'TEST0002' },
          product_name: 'B4モバイルノート GSX400R',
          maker: 'PC工房',
          price: '10830.60',
          sale_point: '格安ハイスペックPC！ 普段使いにストレスを感じさせません！！！',
          stock_quantity: '99'
        }

      ];
        
      let data = {
        "productName": '',
        "maker": '',
        "fromPrice": '',
        "toPrice": '10830.60'
      }  

    httpClientSpyPost.post.and.returnValue(asyncData(listProduct));
    expect(productService.searchProductData).toBeTruthy();
    productService.searchProductData(data).subscribe(
      (result: any[]) => {
        expect(result).toEqual(listProduct);
        expect(result.length).toEqual(2);
      }
    );
  });

  it('Search product  SUCCESS ', () => {
    productService = new ProductService(<any>httpClientSpyPost)
    const listProduct: any[] =
      [
        {
          primaryKey: { product_id: 'TEST0001' },
          product_name: 'B4モバイルノート GSX400R',
          maker: 'PC工房',
          price: '10830.60',
          sale_point: '格安ハイスペックPC！ 普段使いにストレスを感じさせません！！！',
          stock_quantity: '99'
        },
        {
          primaryKey: { product_id: 'TEST0002' },
          product_name: 'B4モバイルノート GSX400R',
          maker: 'PC工房',
          price: '10830.60',
          sale_point: '格安ハイスペックPC！ 普段使いにストレスを感じさせません！！！',
          stock_quantity: '99'
        }

      ];
        
      let data = {
        "productName": '',
        "maker": '',
        "fromPrice": '',
        "toPrice": ''
      }  

    httpClientSpyPost.post.and.returnValue(asyncData(listProduct));
    expect(productService.searchProductData).toBeTruthy();
    productService.searchProductData(data).subscribe(
      (result: any[]) => {
        expect(result).toEqual(listProduct);
        expect(result.length).toEqual(2);
      }
    );
  });

  it('Search product  No DATA ', () => {
    productService = new ProductService(<any>httpClientSpyPost)
    const listProduct: any[] =
      [
        {
          primaryKey: { product_id: 'TEST0001' },
          product_name: 'B4モバイルノート GSX400R',
          maker: 'PC工房',
          price: '10830.60',
          sale_point: '格安ハイスペックPC！ 普段使いにストレスを感じさせません！！！',
          stock_quantity: '99'
        },
        {
          primaryKey: { product_id: 'TEST0002' },
          product_name: 'B4モバイルノート GSX400R',
          maker: 'PC工房',
          price: '10830.60',
          sale_point: '格安ハイスペックPC！ 普段使いにストレスを感じさせません！！！',
          stock_quantity: '99'
        }

      ];
        
      let data = {
        "productName": 'B4モバイルノート GSX400RR',
        "maker": 'PC工房',
        "fromPrice": '10830.60',
        "toPrice": '10830.60'
      }  

    httpClientSpyPost.post.and.returnValue(asyncData(null));
    expect(productService.searchProductData).toBeTruthy();
    productService.searchProductData(data).subscribe(
      (result: any) => {
        expect(result).toEqual(null);
      }
    );
  });

  it('Insert new product cart  SUCCESS ', () => {
    productService = new ProductService(<any>httpClientSpyPost);
    const product_cart : any = {
      user_id: 'testuser',
      product_id: 'TEST0002',
      quantity: '2',
      size: 'X',
      color: '赤'
    }

    let data = {
      userId: 'testuser',
      primaryKey: {productId: 'TEST0002'},
      quantity: '2',
      size: 'X',
      color: '赤'
    }

    httpClientSpyPost.post.and.returnValue(asyncData(product_cart));
    expect(productService.insertNewProductCart).toBeTruthy();
    productService.insertNewProductCart(data,data.quantity,data.userId).subscribe(
      (result: any) => {
        expect(result).toEqual(product_cart);
      }
    );
  });
});

export function asyncData<T>(data: T) {
  return defer(() => Promise.resolve(data));
}
