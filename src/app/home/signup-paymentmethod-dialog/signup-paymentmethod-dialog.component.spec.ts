import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupPaymentmethodDialogComponent } from './signup-paymentmethod-dialog.component';

describe('SignupPaymentmethodDialogComponent', () => {
  let component: SignupPaymentmethodDialogComponent;
  let fixture: ComponentFixture<SignupPaymentmethodDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignupPaymentmethodDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupPaymentmethodDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  //it('should create', () => {
  //  expect(component).toBeTruthy();
  //});
});
