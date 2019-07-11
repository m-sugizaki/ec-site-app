import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingAddressUpdateDialogComponent } from './shipping-address-update-dialog.component';

describe('ShippingAddressUpdateDialogComponent', () => {
  let component: ShippingAddressUpdateDialogComponent;
  let fixture: ComponentFixture<ShippingAddressUpdateDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShippingAddressUpdateDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShippingAddressUpdateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  //it('should create', () => {
  //  expect(component).toBeTruthy();
  //});
});
