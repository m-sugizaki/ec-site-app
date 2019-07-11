import { TestBed, getTestBed } from '@angular/core/testing';

import { UserService } from './user.service';
import { Router } from '@angular/router';

import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { defer } from 'rxjs';
import { HttpClient } from '@angular/common/http';

describe('UserService', () => {
  let router: Router
  let http: HttpClient
  let httpClientSpyGet: { get: jasmine.Spy };
  let httpClientSpyPost: { post: jasmine.Spy };
  let httpClientSpyPut: { put: jasmine.Spy };
  let userService: UserService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [UserService, HttpTestingController]
    });
    httpClientSpyGet = jasmine.createSpyObj('HttpClient', ['get']);
    httpClientSpyPost = jasmine.createSpyObj('HttpClient', ['post']);
    httpClientSpyPut = jasmine.createSpyObj('HttpClient', ['put']);
  });

  it('Should return User Login History Successfully', () => {
    userService = new UserService(router, <any>httpClientSpyGet)
    const userLoginHistoryActual = {
      primaryKey: {
        userId: "testuser1",
        loginDt: new Date()
      }
    }
    const userLoginHistoryExpect = {
      primaryKey: {
        userId: "testuser1",
        loginDt: new Date()
      }
    }
    httpClientSpyGet.get.and.returnValue(asyncData(userLoginHistoryActual));
    expect(userService.getUserLoginHistory).toBeTruthy();
    userService.getUserLoginHistory().subscribe((res: any) => {
      expect(res).toEqual(userLoginHistoryExpect)
    })
  });

  it('Should FAIL to return User Login History', () => {
    userService = new UserService(router, <any>httpClientSpyGet)
    const userLoginHistoryActual = {
      primaryKey: {
        userId: "testuser1",
        loginDt: new Date()
      }
    }
    const userLoginHistoryExpect = {
      primaryKey: {
        userId: "testuser2",
        loginDt: new Date()
      }
    }
    httpClientSpyGet.get.and.returnValue(asyncData(userLoginHistoryActual));
    expect(userService.getUserLoginHistory).toBeTruthy();
    userService.getUserLoginHistory().subscribe((res: any) => {
      expect(res).not.toEqual(userLoginHistoryExpect)
    })
  });

  it('Should return User Info SUCCESSFULLY', () => {
    userService = new UserService(router, <any>httpClientSpyGet)
    const userInfoActual = {
      address1: "都道府県、市町村、丁目番地",
      address2: "",
      birthday: "1996-09-03",
      email: "tester@vn-cubesystem.com",
      memberRank: "一般",
      name: "Tester",
      nickname: "Tester",
      phoneNumber: "09111-495-7644",
      postalCode: "159-7531",
      primaryKey: { userId: "testuser1" },
    }
    const userInfoExpect = {
      address1: "都道府県、市町村、丁目番地",
      address2: "",
      birthday: "1996-09-03",
      email: "tester@vn-cubesystem.com",
      memberRank: "一般",
      name: "Tester",
      nickname: "Tester",
      phoneNumber: "09111-495-7644",
      postalCode: "159-7531",
      primaryKey: { userId: "testuser1" },
    }
    httpClientSpyGet.get.and.returnValue(asyncData(userInfoActual));
    expect(userService.getUserInfo).toBeTruthy();
    userService.getUserInfo().subscribe((res: any) => {
      expect(res).toEqual(userInfoExpect)
    })
  });

  it('Should FAIL to return User Info', () => {
    userService = new UserService(router, <any>httpClientSpyGet)
    const userInfoActual = {
      address1: "都道府県、市町村、丁目番地",
      address2: "",
      birthday: "1996-09-03",
      email: "tester@vn-cubesystem.com",
      memberRank: "一般",
      name: "Tester",
      nickname: "Tester",
      phoneNumber: "09111-495-7644",
      postalCode: "159-7531",
      primaryKey: { userId: "testuser1" },
    }
    const userInfoExpect = {
      address1: "都道府県、市町村、丁目番地",
      address2: "",
      birthday: "1996-09-03",
      email: "tester@vn-cubesystem.com",
      memberRank: "一般",
      name: "Tester",
      nickname: "Tester",
      phoneNumber: "09111-495-7644",
      postalCode: "159-7531",
      primaryKey: { userId: "testuser2" },
    }
    httpClientSpyGet.get.and.returnValue(asyncData(userInfoActual));
    expect(userService.getUserInfo).toBeTruthy();
    userService.getUserInfo().subscribe((res: any) => {
      expect(res).not.toEqual(userInfoExpect)
    })
  });

  it('Should return List of User Info SUCCESSFULLY', () => {
    userService = new UserService(router, <any>httpClientSpyGet)
    const listUserInfoActual = [
      {
        address1: "都道府県、市町村、丁目番地",
        address2: "",
        birthday: "1996-05-01",
        email: "tester1@vn-cubesystem.com",
        memberRank: "一般",
        name: "Tester",
        nickname: "Tester",
        phoneNumber: "09112-111-3335",
        postalCode: "475-2221",
        primaryKey: { userId: "testuser1" },
      },
      {
        address1: "都道府県、市町村、丁目番地2",
        address2: "",
        birthday: "1996-09-03",
        email: "tester2@vn-cubesystem.com",
        memberRank: "一般",
        name: "Tester2",
        nickname: "Tester2",
        phoneNumber: "09111-495-7644",
        postalCode: "159-7531",
        primaryKey: { userId: "testuser2" },
      }
    ]
    let listUserId = ['testuser1', 'testuser2']

    httpClientSpyGet.get.and.returnValue(asyncData(listUserInfoActual));
    expect(userService.getUserInfoByUserIdList).toBeTruthy();
    userService.getUserInfoByUserIdList(listUserId).subscribe((res: any) => {
        expect(res[0].primaryKey.userId).toEqual('testuser1')
        expect(res[0].address1).toEqual(listUserInfoActual[0].address1)
        expect(res[0].address2).toEqual(listUserInfoActual[0].address2)
        expect(res[0].birthday).toEqual(listUserInfoActual[0].birthday)
        expect(res[0].email).toEqual(listUserInfoActual[0].email)
        expect(res[0].memberRank).toEqual(listUserInfoActual[0].memberRank)
        expect(res[0].name).toEqual(listUserInfoActual[0].name)
        expect(res[0].nickname).toEqual(listUserInfoActual[0].nickname)
        expect(res[0].phoneNumber).toEqual(listUserInfoActual[0].phoneNumber)
        expect(res[0].postalCode).toEqual(listUserInfoActual[0].postalCode)

        expect(res[1].primaryKey.userId).toEqual('testuser2')
        expect(res[1].address1).toEqual(listUserInfoActual[1].address1)
        expect(res[1].address2).toEqual(listUserInfoActual[1].address2)
        expect(res[1].birthday).toEqual(listUserInfoActual[1].birthday)
        expect(res[1].email).toEqual(listUserInfoActual[1].email)
        expect(res[1].memberRank).toEqual(listUserInfoActual[1].memberRank)
        expect(res[1].name).toEqual(listUserInfoActual[1].name)
        expect(res[1].nickname).toEqual(listUserInfoActual[1].nickname)
        expect(res[1].phoneNumber).toEqual(listUserInfoActual[1].phoneNumber)
        expect(res[1].postalCode).toEqual(listUserInfoActual[1].postalCode)
        res.forEach(element => {
          expect(listUserId).toContain(element.primaryKey.userId)
        });
    })
  });

  it('Should be able to Insert Login History ', () => {
    userService = new UserService(router, <any>httpClientSpyPost)
    let login_date = new Date()
    const userLoginHistoryActual = {
      primaryKey: {
        userId: "testuser1",
        loginDt: login_date
      }
    }
    const userLoginHistoryExpect = {
      primaryKey: {
        userId: "testuser1",
        loginDt: login_date
      }
    }

    httpClientSpyPost.post.and.returnValue(asyncData(userLoginHistoryActual));
    expect(userService.insertLoginHistory).toBeTruthy();
    userService.insertLoginHistory('testuser1').subscribe(
      (result: any) => {
        expect(result).toEqual(userLoginHistoryExpect);
      }
    );
  });

  it('Should be able to Insert new Account ', () => {
    userService = new UserService(router, <any>httpClientSpyPost)
    let userId = 'testuser2'
    let password = '123456'
    let userActual = {
      "primaryKey": {"userId": userId},
      "password": password
    }
    const userExpect = {
      primaryKey:
       { userId: "testuser2"},
        password: "123456"

    }

    httpClientSpyPost.post.and.returnValue(asyncData(userActual));
    expect(userService.insertNewAccount).toBeTruthy();
    userService.insertNewAccount(userId, password).subscribe(
      (result: any) => {
        expect(result).toEqual(userExpect);
      }
    );
  });

  it('Should be able to Insert new User Info ', () => {
    userService = new UserService(router, <any>httpClientSpyPost)
    let user = {
      user_id: "testuser3",
      name : "Tester3",
      nickname: "Tester3",
      postalCode : "123-4567",
      address1: "都道府県、市町村、丁目番地",
      address2: "",
      phoneNumber: "09111-495-7644",
      email: "tester3@gmail.com",
      birthday: "1996-09-03",
      memberRank: "一般"
    }
    let userInfoActual = {
      "primaryKey":{"userId":user.user_id},
      "name" : user.name,
      "nickname":user.nickname,
      "postalCode" : user.postalCode,
      "address1":user.address1,
      "address2":user.address2,
      "phoneNumber":user.phoneNumber,
      "email":user.email,
      "birthday":user.birthday,
      "memberRank":user.memberRank
    }
    const userExpect = {
      "primaryKey":{"userId": "testuser3"},
      name : "Tester3",
      nickname: "Tester3",
      postalCode : "123-4567",
      address1: "都道府県、市町村、丁目番地",
      address2: "",
      phoneNumber: "09111-495-7644",
      email: "tester3@gmail.com",
      birthday: "1996-09-03",
      memberRank: "一般"
    }

    httpClientSpyPost.post.and.returnValue(asyncData(userInfoActual));
    expect(userService.insertNewUserInfo).toBeTruthy();
    userService.insertNewUserInfo(user).subscribe(
      (result: any) => {
        expect(result).toEqual(userExpect);
      }
    );
  });

  it('Should be able to Update User Info ', () => {
    userService = new UserService(router, <any>httpClientSpyPut)
    let user = {
      user_id: "testuser3",
      name : "Tester3",
      nickname: "Tester3",
      postalCode : "123-1111",
      address1: "都道府県、市町村、丁目番地",
      address2: "",
      phoneNumber: "09111-495-3214",
      email: "tester3@gmail.com",
      birthday: "1996-09-03",
      memberRank: "一般"
    }
    let userInfoActual = {
      "primaryKey":{"userId":user.user_id},
      "name" : user.name,
      "nickname":user.nickname,
      "postalCode" : user.postalCode,
      "address1":user.address1,
      "address2":user.address2,
      "phoneNumber":user.phoneNumber,
      "email":user.email,
      "birthday":user.birthday,
      "memberRank":user.memberRank
    }
    const userExpect = {
      "primaryKey":{"userId": "testuser3"},
      name : "Tester3",
      nickname: "Tester3",
      postalCode : "123-1111",
      address1: "都道府県、市町村、丁目番地",
      address2: "",
      phoneNumber: "09111-495-3214",
      email: "tester3@gmail.com",
      birthday: "1996-09-03",
      memberRank: "一般"
    }

    httpClientSpyPut.put.and.returnValue(asyncData(userInfoActual));
    expect(userService.updateUserInfo).toBeTruthy();
    userService.updateUserInfo(user).subscribe(
      (result: any) => {
        expect(result).toEqual(userExpect);
      }
    );
  });

  it('Should be able to Update User and Password ', () => {
    userService = new UserService(router, <any>httpClientSpyPut)
    let passwordExpect = '1234567'
    let userInfoActual={
      "primaryKey":{"userId":"testuser6"},"password": "1234567"
    }

    httpClientSpyPut.put.and.returnValue(asyncData(userInfoActual));
    expect(userService.updateUser).toBeTruthy();
    userService.updateUser('testuser', '1234567').subscribe(
      (result: any) => {
        expect(result.password).toEqual(passwordExpect);
      }
    );
  });

  it('Should return a User ', () => {
    userService = new UserService(router, <any>httpClientSpyPost)
    let userId = 'testuser2'
    let password = '123456'
    let userActual = {
      "primaryKey": {"userId": userId},
      "password": password
    }
    const userExpect = {
      primaryKey:
       { userId: "testuser2"},
        password: "123456"

    }

    httpClientSpyPost.post.and.returnValue(asyncData(userActual));
    expect(userService.checkUser).toBeTruthy();
    userService.checkUser(userId, password).subscribe(
      (result: any) => {
        expect(result).toEqual(userExpect);
      }
    );
  });

  it('Should return a token and userId ', () => {
    userService = new UserService(router, <any>httpClientSpyPost)
    let userId = 'manhkhang'
    let password = '123456'

    let userActual = [{
      userId: userId,
      token: "eyJhbGciOiJIUzI1NiJ9.eyJwYXNzd29yZCI6IjEyMzQ1NiIsImV4cCI6MTU1ODA2Njg1MywidXNlcm5hbWUiOiJtYW5oa2hhbmcifQ.xVwybMCtaFNrpqAx_eEWJEXWJXKOcE1Xg6cTShG6ZcY"
    }]
    const userExpect = {
      userId: 'manhkhang',
      token: "eyJhbGciOiJIUzI1NiJ9.eyJwYXNzd29yZCI6IjEyMzQ1NiIsImV4cCI6MTU1ODA2Njg1MywidXNlcm5hbWUiOiJtYW5oa2hhbmcifQ.xVwybMCtaFNrpqAx_eEWJEXWJXKOcE1Xg6cTShG6ZcY"
    }

    httpClientSpyPost.post.and.returnValue(asyncData(userActual));
    expect(userService.login).toBeTruthy();
    userService.login(userId, password).subscribe(
      (result: any) => {
        expect(result[0]).toEqual(userExpect);
      }
    );
  });

  it('Check is Logged In ', () => {
    userService = new UserService(router, <any>httpClientSpyPost)
    let userId = 'testuser5'

    let userActual = [{fullName: "Tester5", permission: "一般", userId: userId}]
    const userExpect = {fullName: "Tester5", permission: "一般", userId: "testuser5"}

    httpClientSpyPost.post.and.returnValue(asyncData(userActual));
    expect(userService.isLoggedIn).toBeTruthy();
    userService.isLoggedIn().subscribe(
      (result: any) => {
        expect(result.userId).toEqual(userExpect.userId);
      }
    );
  });

  it('should have a token', () => {
    userService = new UserService(router, http)
    let token = "eyJhbGciOiJIUzI1NiJ9.eyJwYXNzd29yZCI6IjEyMzQ1NiIsImV4cCI6MTU1ODA2Njg1MywidXNlcm5hbWUiOiJtYW5oa2hhbmcifQ.xVwybMCtaFNrpqAx_eEWJEXWJXKOcE1Xg6cTShG6ZcY"

    userService.setToken(token)

    expect(localStorage.getItem('token')).not.toBeNull()
  });

  it('Should remove token', () => {
    userService = new UserService(router, http)
    let token = "eyJhbGciOiJIUzI1NiJ9.eyJwYXNzd29yZCI6IjEyMzQ1NiIsImV4cCI6MTU1ODA2Njg1MywidXNlcm5hbWUiOiJtYW5oa2hhbmcifQ.xVwybMCtaFNrpqAx_eEWJEXWJXKOcE1Xg6cTShG6ZcY"
    localStorage.setItem('token', token);

    userService.removeToken()

    expect(localStorage.getItem('token')).toBeNull()
  });

  it('Should remove token and username', () => {
    userService = new UserService(router, http);
    let token = "eyJhbGciOiJIUzI1NiJ9.eyJwYXNzd29yZCI6IjEyMzQ1NiIsImV4cCI6MTU1ODA2Njg1MywidXNlcm5hbWUiOiJtYW5oa2hhbmcifQ.xVwybMCtaFNrpqAx_eEWJEXWJXKOcE1Xg6cTShG6ZcY";
    let username = "manhkhang";
    sessionStorage.setItem('username', username);
    localStorage.setItem('token', token);

    userService.logOut()

    expect(localStorage.getItem('token')).toBeNull()
    expect(sessionStorage.getItem('username')).toBeNull()
  });

  it('Should return True when user has Payment method', () => {
    userService = new UserService(router, <any>httpClientSpyGet)
    httpClientSpyGet.get.and.returnValue(asyncData(true));
    expect(userService.hasPaymentMethod).toBeTruthy();
    userService.hasPaymentMethod('testuser').subscribe(
      (result: any) => {
        expect(result).toBeTruthy();
      }
    );
  });
});

export function asyncData<T>(data: T) {
  return defer(() => Promise.resolve(data));
}
