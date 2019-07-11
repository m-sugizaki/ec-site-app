import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePaymentmethodDialogComponent } from './update-paymentmethod-dialog.component';

describe('UpdatePaymentmethodDialogComponent', () => {
  let component: UpdatePaymentmethodDialogComponent;
  let fixture: ComponentFixture<UpdatePaymentmethodDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdatePaymentmethodDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatePaymentmethodDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  //it('should create', () => {
  //  expect(component).toBeTruthy();
  //});
});
