import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistryReviewInfoDialogComponent } from './registry-review-info-dialog.component';

describe('RegistryReviewInfoDialogComponent', () => {
  let component: RegistryReviewInfoDialogComponent;
  let fixture: ComponentFixture<RegistryReviewInfoDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistryReviewInfoDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistryReviewInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  //it('should create', () => {
  //  expect(component).toBeTruthy();
  //});
});
