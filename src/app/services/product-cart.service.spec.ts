import { TestBed,inject, fakeAsync, async } from '@angular/core/testing';

import { ProductCartService } from './product-cart.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { defer } from 'rxjs/internal/observable/defer';

describe('ProductCartService', () => {

      let service: ProductCartService;
      let httpClientSpyGet: { get: jasmine.Spy };
      let httpClientSpyPost: { post: jasmine.Spy };
      let httpClientSpyPut: { put : jasmine.Spy };
      let httpClientSpyDelete: { delete : jasmine.Spy };
      beforeEach(() => {
        TestBed.configureTestingModule({
        imports: [RouterTestingModule,HttpClientTestingModule],
        providers: [ProductCartService],
      })
      httpClientSpyGet = jasmine.createSpyObj('HttpClient', ['get']);
      httpClientSpyPost = jasmine.createSpyObj('HttpClient', ['post']);
      httpClientSpyPut = jasmine.createSpyObj('HttpClient', ['put']);
      httpClientSpyDelete = jasmine.createSpyObj('HttpClient', ['delete']);
    });

    it('should be created', () => {
      const service: ProductCartService = TestBed.get(ProductCartService);
      expect(service).toBeTruthy();
    });

    it('Get Product Cart Info By User ID SUCCESS ', () => {
      service = new ProductCartService(<any>httpClientSpyGet)
      
      const listProductCart : any [] =
      [
        {
          product_cart_id: '111',
          product_id: 'TEST0001',
          user_id: 'testuser',
          quantity: '10',
          size: 'X',
          color: '赤',
          cart_regist_dt: '2019-05-01 12:20:02',
        },
        {
          product_cart_id: '112',
          product_id: 'TEST0002',
          user_id: 'testuser',
          quantity: '5',
          size: 'XL',
          color: '赤',
          cart_regist_dt: '2019-05-01 12:21:10',
        }
      ]
    
      httpClientSpyGet.get.and.returnValue(asyncData(listProductCart));
      expect(service.getProductCartInfoByUserID).toBeTruthy();
      service.getProductCartInfoByUserID('testuser').subscribe(
        (list: any[]) => {
          expect(list).toEqual(listProductCart);
          expect(list.length).toEqual(2);
        }
      );
    });

    it('Delete Product Cart SUCCESS ', () => {
    
      service = new ProductCartService(<any>httpClientSpyDelete)
      
      const product_cart_id = '111';
      const status = {
        200 : 'OK'
      }
    
      httpClientSpyDelete.delete.and.returnValue(asyncData(status));
      expect(service.deleteProductCart).toBeTruthy();
      service.deleteProductCart(product_cart_id).subscribe(
        (result : any) => {
          expect(result).toEqual(status);
        }
      );
    
    });

    it('Get Product Cart Info By Key SUCCESS ', () => {
      service = new ProductCartService(<any>httpClientSpyGet)
      
      const product_cart : any = 
      {
        product_cart_id: '111',
        product_id: 'TEST0001',
        user_id: 'testuser',
        quantity: '10',
        size: 'X',
        color: '赤',
        cart_regist_dt: '2019-05-01 12:20:01',
      }
    
      httpClientSpyGet.get.and.returnValue(asyncData(product_cart));
      expect(service.getProductCartInfoByKey).toBeTruthy();
      service.getProductCartInfoByKey('111').subscribe(
        (result : any)=>{
            expect(result).toEqual(product_cart);
        });
    });

    it('Update Product Cart SUCCESS ', () => {
  service = new ProductCartService(<any>httpClientSpyPut)
  
  const product_cart : any = 
  {
    product_cart_id: '111',
    product_id: 'TEST0001',
    user_id: 'testuser',
    quantity: '10',
    size: 'X',
    color: '赤',
    cart_regist_dt: '2019-05-01 12:20:01',
  }

  httpClientSpyPut.put.and.returnValue(asyncData(product_cart));
  expect(service.updateProductCart).toBeTruthy();
  service.updateProductCart(product_cart).subscribe(
    (result:any)=>{
      expect(result).toEqual(product_cart);
    }
  );

});        

it('Insert Product Cart SUCCESS ', () => {
  
  service = new ProductCartService(<any>httpClientSpyPost);
  
  const product_cart : any = {
    user_id: 'testuser',
    product_id: 'TEST0002',
    quantity: '2',
    size: 'X',
    color: '赤'
  }

  let data = {
    userId: 'testuser',
    productId: 'TEST0002',
    quantity: '2',
    size: 'X',
    color: '赤'
  }

  httpClientSpyPost.post.and.returnValue(asyncData(product_cart));
  expect(service.insertNewProductCart).toBeTruthy();
  service.insertNewProductCart(data,data.userId).subscribe(
    (result : any) =>{
        expect(result).toEqual(product_cart);
    }
  );
});

});
export function asyncData<T>(data: T) {
  return defer(() => Promise.resolve(data));
}