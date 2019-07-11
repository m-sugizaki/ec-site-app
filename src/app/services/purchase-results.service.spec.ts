import { TestBed } from '@angular/core/testing';
import { PurchaseResultsService } from './purchase-results.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { defer } from 'rxjs/internal/observable/defer';

describe('PurchaseResultsService', () => {

  let service: PurchaseResultsService;
  let httpClientSpyGet: { get: jasmine.Spy };
  let httpClientSpyPost: { post: jasmine.Spy };
  let httpClientSpyPut: { put : jasmine.Spy };
  let httpClientSpyDelete: { delete : jasmine.Spy };

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [RouterTestingModule,HttpClientTestingModule],
        providers: [PurchaseResultsService],
    })

    httpClientSpyGet = jasmine.createSpyObj('HttpClient', ['get']);
    httpClientSpyPost = jasmine.createSpyObj('HttpClient', ['post']);
    httpClientSpyPut = jasmine.createSpyObj('HttpClient', ['put']);
    httpClientSpyDelete = jasmine.createSpyObj('HttpClient', ['delete']);
  });

  it('should be created', () => {
    const service: PurchaseResultsService = TestBed.get(PurchaseResultsService);
    expect(service).toBeTruthy();
  });

  it('Insert Purchase Result SUCCESS', () => {

    service = new PurchaseResultsService(<any>httpClientSpyPost);

    const purchaseResult : any =  {
      product_id : 'TEST0001',
      color:'赤',
      size: 'XL',
      quantity:'99',
      user_id: 'testuser',
      paymentNo: '0',
      shippingAddressNo :'0',
      paymentMethod:'銀行引落し'
    }

    httpClientSpyPost.post.and.returnValue(asyncData(purchaseResult));
    expect(service.insertPurchaseResult).toBeTruthy();
    service.insertPurchaseResult(purchaseResult).subscribe(
      (result : any) =>{
        expect(result).toEqual(purchaseResult);
      }
    );
  });
  
  it('Get Purchase Results Info By UserID List SUCCESS', () => {

      service = new PurchaseResultsService(<any>httpClientSpyGet);

      const listPurchaseResult : any[] = [
        {
          order_no : '1',
          product_id : 'TEST0001',
          color:'赤',
          size: 'XL',
          quantity:'99',
          user_id: 'testuser',
          paymentNo: '0',
          shippingAddressNo :'0',
          paymentMethod:'銀行引落し',
          order_dt :'2019-05-01',
          order_status:'注文確定',
          delivery_plan_dt :'2019-05-03',
          delivery_completion_dt:''
        },
        {
          order_no : '2',
          product_id : 'TEST0002',
          color:'赤',
          size: 'XL',
          quantity:'99',
          user_id: 'testuser2',
          paymentNo: '0',
          shippingAddressNo :'0',
          paymentMethod:'銀行引落し',
          order_dt :'2019-05-01',
          order_status:'注文確定',
          delivery_plan_dt :'2019-05-03',
          delivery_completion_dt:''
        }
      ]

      httpClientSpyGet.get.and.returnValue(asyncData(listPurchaseResult));
      expect(service.getPurchaseResultsInfoByUserIDList).toBeTruthy();
      service.getPurchaseResultsInfoByUserIDList('testuser,testuser2').subscribe(
        (list : any[]) => {
          expect(list).toEqual(listPurchaseResult);
          expect(list.length).toEqual(2);
        }
      );
  });

  it('Update Purchase Result SUCCESS', () => {
    service = new PurchaseResultsService(<any>httpClientSpyPut);

    const purchaseResult : any = {
      order_no : '1',
      product_id : 'TEST0001',
      color:'赤',
      size: 'XL',
      quantity:'99',
      user_id: 'testuser',
      paymentNo: '0',
      shippingAddressNo :'0',
      paymentMethod:'銀行引落し',
      order_dt :'2019-05-01',
      order_status:'注文確定',
      delivery_plan_dt :'2019-05-03',
      delivery_completion_dt:''
    }

    httpClientSpyPut.put.and.returnValue(asyncData(purchaseResult));
    expect(service.updatePurchaseResult).toBeTruthy();
    service.updatePurchaseResult(purchaseResult).subscribe(
      (result : any) => {
        expect(result).toEqual(purchaseResult);
      }
    );
  })
});

export function asyncData<T>(data: T) {
  return defer(() => Promise.resolve(data));
}
