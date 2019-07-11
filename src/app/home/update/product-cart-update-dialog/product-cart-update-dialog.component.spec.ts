import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCartUpdateDialogComponent } from './product-cart-update-dialog.component';

describe('ProductCartUpdateDialogComponent', () => {
  let component: ProductCartUpdateDialogComponent;
  let fixture: ComponentFixture<ProductCartUpdateDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductCartUpdateDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductCartUpdateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  //it('should create', () => {
  //  expect(component).toBeTruthy();
  //});
});
