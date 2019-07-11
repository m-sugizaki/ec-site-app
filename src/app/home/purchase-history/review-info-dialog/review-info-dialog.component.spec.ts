import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewInfoDialogComponent } from './review-info-dialog.component';

describe('ReviewInfoDialogComponent', () => {
  let component: ReviewInfoDialogComponent;
  let fixture: ComponentFixture<ReviewInfoDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewInfoDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  //it('should create', () => {
  //  expect(component).toBeTruthy();
  //});
});
