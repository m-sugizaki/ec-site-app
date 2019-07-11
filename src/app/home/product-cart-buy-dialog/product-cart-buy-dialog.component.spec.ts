import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCartBuyDialogComponent } from './product-cart-buy-dialog.component';

describe('ProductCartBuyDialogComponent', () => {
  let component: ProductCartBuyDialogComponent;
  let fixture: ComponentFixture<ProductCartBuyDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductCartBuyDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductCartBuyDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  //it('should create', () => {
  //  expect(component).toBeTruthy();
  //});
});
