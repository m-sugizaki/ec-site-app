import { TestBed } from '@angular/core/testing';

import { ShippingService } from './shipping.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { defer } from 'rxjs';

describe('ShippingService', () => {
  let shippingService: ShippingService;
  let router: Router;
  let http: HttpClient;
  let httpClientSpyGet: { get: jasmine.Spy };
  let httpClientSpyPost: { post: jasmine.Spy };
  let httpClientSpyPut: { put: jasmine.Spy };
  let httpClientSpyDelete: { delete: jasmine.Spy };
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [ShippingService, HttpTestingController]
    });
    httpClientSpyGet = jasmine.createSpyObj('HttpClient', ['get']);
    httpClientSpyPost = jasmine.createSpyObj('HttpClient', ['post']);
    httpClientSpyPut = jasmine.createSpyObj('HttpClient', ['put']);
    httpClientSpyDelete = jasmine.createSpyObj('HttpClient', ['delete']);
  });

  it('should be created', () => {
    const shippingService = new ShippingService(router, http)
    expect(shippingService).toBeTruthy();
  });

  it('Should return Shipping Address Successfully', () => {
    shippingService = new ShippingService(router, <any>httpClientSpyGet)
    const shippingAddressActual : any[] = [ 
    {
      address1: "都道府県、市町村、丁目番地",
      address2: null,
      phoneNumber: "45611-1231-4564",
      postalCode: "789-4564",
      primaryKey: { userId: "testuser8", shippingAddressNo: 1 },
      shippingAddressName: "テストユーザのお届け先名"
    },
    {
      address1: "都道府県、市町村、丁目番地",
      address2: null,
      phoneNumber: "456-1231-4564",
      postalCode: "789-4564",
      primaryKey: { userId: "testuser8", shippingAddressNo: 1 },
      shippingAddressName: "テストユーザのお届け先名"
    }]
    httpClientSpyGet.get.and.returnValue(asyncData(shippingAddressActual));
    expect(shippingService.getShippingAddressByUserID).toBeTruthy();
    shippingService.getShippingAddressByUserID("testuser8").subscribe((res: any[]) => {
      expect(res).toEqual(shippingAddressActual);
      expect(res.length).toEqual(2);
    })
  });

  it('Should be able to Insert Shipping Address ', () => {
    shippingService = new ShippingService(router, <any>httpClientSpyPost)
    let shippingAddress = {
      shipping_address_no: "1",
      user_id: "testuser9",
      postal_code: "123-4564",
      address1: "都道府県、市町村、丁目番地",
      address2: "",
      phone_number: "09111-457-6447",
      shipping_address_name: "テストユーザのお届け先名"
    }
    let dataActual = {
      "primaryKey": { "shippingAddressNo": shippingAddress.shipping_address_no, "userId": shippingAddress.user_id },
      "postalCode": shippingAddress.postal_code,
      "address1": shippingAddress.address1,
      "address2": shippingAddress.address2,
      "phoneNumber": shippingAddress.phone_number,
      "shippingAddressName": shippingAddress.shipping_address_name
    }
    let dataExpect = {
      "primaryKey": { "shippingAddressNo": "1", "userId": "testuser9" },
      "postalCode": "123-4564",
      "address1": "都道府県、市町村、丁目番地",
      "address2": "",
      "phoneNumber": "09111-457-6447",
      "shippingAddressName": "テストユーザのお届け先名"
    }

    httpClientSpyPost.post.and.returnValue(asyncData(dataActual));
    expect(shippingService.insertNewShippingAddress).toBeTruthy();
    shippingService.insertNewShippingAddress(shippingAddress).subscribe(
      (result: any) => {
        expect(result).toEqual(dataExpect);
      }
    );
  });

  it('Should return Shipping Address Info Successfully', () => {
    shippingService = new ShippingService(router, <any>httpClientSpyGet)
    let user_id = 'testuser0'
    let shipping_address_no = 1
    const shippingAddressActual = {
      address1: "都道府県、市町村、丁目番地",
      address2: null,
      phoneNumber: "45611-1231-4564",
      postalCode: "789-4564",
      primaryKey: { userId: user_id, shippingAddressNo: shipping_address_no },
      shippingAddressName: "テストユーザのお届け先名"
    }
    const shippingAddressExpect = {
      address1: "都道府県、市町村、丁目番地",
      address2: null,
      phoneNumber: "45611-1231-4564",
      postalCode: "789-4564",
      primaryKey: { userId: "testuser0", shippingAddressNo: 1 },
      shippingAddressName: "テストユーザのお届け先名"
    }
    httpClientSpyGet.get.and.returnValue(asyncData(shippingAddressActual));
    expect(shippingService.getShippingAddressInfo).toBeTruthy();
    shippingService.getShippingAddressInfo(user_id, shipping_address_no).subscribe((res: any) => {
      expect(res).toEqual(shippingAddressExpect)
    })
  });

  it('Should Fail to return Shipping Address Info', () => {
    shippingService = new ShippingService(router, <any>httpClientSpyGet)
    let user_id = 'testuser0'
    let shipping_address_no = 1
    const shippingAddressActual = {
      address1: "都道府県、市町村、丁目番地",
      address2: null,
      phoneNumber: "45611-1231-4564",
      postalCode: "789-4564",
      primaryKey: { userId: user_id, shippingAddressNo: shipping_address_no },
      shippingAddressName: "テストユーザのお届け先名"
    }
    const shippingAddressExpect = {
      address1: "都道府県、市町村、丁目番地",
      address2: null,
      phoneNumber: "45611-1231-4564",
      postalCode: "789-4564",
      primaryKey: { userId: "testuser1", shippingAddressNo: 2 },
      shippingAddressName: "テストユーザのお届け先名"
    }
    httpClientSpyGet.get.and.returnValue(asyncData(shippingAddressActual));
    expect(shippingService.getShippingAddressInfo).toBeTruthy();
    shippingService.getShippingAddressInfo(user_id, shipping_address_no).subscribe((res: any) => {
      expect(res).not.toEqual(shippingAddressExpect)
    })
  });

  it('Should be able to Update Shipping Address Info ', () => {
    shippingService = new ShippingService(router, <any>httpClientSpyPut)
    let shippingAddress = {
      shipping_address_no: "1",
      user_id: "testuser9",
      postal_code: "123-4564",
      address1: "都道府県、市町村、丁目番地",
      address2: "",
      phone_number: "09111-457-6447",
      shipping_address_name: "テストユーザのお届け先名"
    }
    let dataActual = {
      "primaryKey": { "shippingAddressNo": shippingAddress.shipping_address_no, "userId": shippingAddress.user_id },
      "postalCode": shippingAddress.postal_code,
      "address1": shippingAddress.address1,
      "address2": shippingAddress.address2,
      "phoneNumber": shippingAddress.phone_number,
      "shippingAddressName": shippingAddress.shipping_address_name
    }
    let dataExpect = {
      "primaryKey": { "shippingAddressNo": "1", "userId": "testuser9" },
      "postalCode": "123-4564",
      "address1": "都道府県、市町村、丁目番地",
      "address2": "",
      "phoneNumber": "09111-457-6447",
      "shippingAddressName": "テストユーザのお届け先名"
    }

    httpClientSpyPut.put.and.returnValue(asyncData(dataActual));
    expect(shippingService.updateShippingAddress).toBeTruthy();
    shippingService.updateShippingAddress(shippingAddress).subscribe(
      (result: any) => {
        expect(result).toEqual(dataExpect);
      }
    );
  });

  it('Should be able to delete Shipping Address info', () => {
    shippingService = new ShippingService(router, <any>httpClientSpyDelete)
    let user_id = 'testuser0'
    let shipping_address_no = 1

    httpClientSpyDelete.delete.and.returnValue(asyncData(true));
    expect(shippingService.deleteShippingAddress).toBeTruthy();
    shippingService.deleteShippingAddress(user_id,shipping_address_no).subscribe((res: any) => {
      expect(res).toBeTruthy()
    })
  });

});

export function asyncData<T>(data: T) {
  return defer(() => Promise.resolve(data));
}
