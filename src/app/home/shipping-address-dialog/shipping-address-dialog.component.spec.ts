import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingAddressDialogComponent } from './shipping-address-dialog.component';

describe('ShippingAddressDialogComponent', () => {
  let component: ShippingAddressDialogComponent;
  let fixture: ComponentFixture<ShippingAddressDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShippingAddressDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShippingAddressDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  //it('should create', () => {
  //  expect(component).toBeTruthy();
  //});
});
