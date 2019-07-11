import { TestBed , inject} from '@angular/core/testing';
import { PaymentService } from './payment.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { defer } from 'rxjs/internal/observable/defer';
import { RouterTestingModule } from '@angular/router/testing';
import { STATUS_CODES } from 'http';

describe('PaymentService', () => {

  let service:PaymentService;
  let httpClientSpyGet: { get: jasmine.Spy };
  let httpClientSpyPost: { post: jasmine.Spy };
  let httpClientSpyPut: { put : jasmine.Spy };
  let httpClientSpyDelete: { delete : jasmine.Spy };

  beforeEach(() => {
    TestBed.configureTestingModule({
   imports: [RouterTestingModule,HttpClientTestingModule],
    providers: [PaymentService],
  });
  httpClientSpyGet = jasmine.createSpyObj('HttpClient', ['get']);
  httpClientSpyPost = jasmine.createSpyObj('HttpClient', ['post']);
  httpClientSpyPut = jasmine.createSpyObj('HttpClient', ['put']);
  httpClientSpyDelete = jasmine.createSpyObj('HttpClient', ['delete']);
});

it('should be created', () => {
  const service: PaymentService = TestBed.get(PaymentService);
  expect(service).toBeTruthy();
});

it('Get Paument Method By User ID SUCCESS ', () => {

    service = new PaymentService(<any>httpClientSpyGet);

    const listPaymentMethod: any[] = [ 
      {
      user_id: 'testuser',
      payment_no: '1',
      payment_method: '銀行振込み',
      card_number: '7819-4564-1231-1211',
      expiration_date: '2019-05-01',
      card_holder_name: 'テストユーザー',
      },
      {
        user_id: 'testuser',
        payment_no: '2',
        payment_method: '銀行振込み',
        card_number: '7819-4564-1231-1211',
        expiration_date: '2019-05-01',
        card_holder_name: 'テストユーザー',
      }
    ]

    httpClientSpyGet.get.and.returnValue(asyncData(listPaymentMethod));
    expect(service.getPaymentMethodByUserID).toBeTruthy();
    service.getPaymentMethodByUserID("testuser").subscribe(
      (list : any[]) =>{
          expect(list).toEqual(listPaymentMethod);
          expect(list.length).toEqual(2);
      }
    );
  }); 
  it('Get Max Payment Method No Of User SUCCESS ',()=>{
          
    service = new PaymentService(<any>httpClientSpyGet);
    
    const maxPaymentNo = 20;
    const userId = 'testuser'

    httpClientSpyGet.get.and.returnValue(asyncData(maxPaymentNo));
    expect(service.getMaxPaymentMethodNoOfUser).toBeTruthy();
    service.getMaxPaymentMethodNoOfUser(userId).subscribe(
      (result : any)=>{
          expect(result).toEqual(maxPaymentNo);
      });

  });

  it('Insert New Payment Method SUCCESS ',()=>{

    service = new PaymentService(<any>httpClientSpyPost);
    
    const paymentMethod : any = {
      user_id: 'testuser',
      payment_no: '1',
      payment_method: '銀行振込み',
      card_number: '7819-4564-1231-1211',
      expiration_date: '2019-05-01',
      owner_name: 'テストユーザー',
    }

    httpClientSpyPost.post.and.returnValue(asyncData(paymentMethod));
    expect(service.insertNewPaymentMethod).toBeTruthy();
    service.insertNewPaymentMethod(paymentMethod).subscribe(
      (result : any) =>{
        expect(result).toEqual(paymentMethod);
      }
    );
  });

  it('Delete Payment Method SUCCESS', ()=>{
      service = new  PaymentService(<any>httpClientSpyDelete);
      
      const payment_no = '1';
      const userId = 'testuser';
      const status = {
        200 : 'OK'
      }
      

      httpClientSpyDelete.delete.and.returnValue(asyncData(status));
      expect(service.deletePaymentMethod).toBeTruthy();
      service.deletePaymentMethod(userId,payment_no).subscribe(
        (result : any)=>{
          expect(result).toEqual(status);
        }
      );
  });

  it('Update Payment Method SUCCESS', () => {

      service = new PaymentService(<any>httpClientSpyPut);

      const paymentMethod : any = {
        user_id: 'testuser',
        payment_no: '1',
        payment_method: '銀行振込み',
        card_number: '7819-4564-1231-1211',
        expiration_date: '2019-05-01',
        owner_name: 'テストユーザー',
      }

      httpClientSpyPut.put.and.returnValue(asyncData(paymentMethod));
      expect(service.updatePaymentMethod).toBeTruthy();
      service.updatePaymentMethod(paymentMethod).subscribe(
        (result : any) => {
          expect(result).toEqual(paymentMethod);
        }
      );
  });

});

export function asyncData<T>(data: T) {
  return defer(() => Promise.resolve(data));
}
