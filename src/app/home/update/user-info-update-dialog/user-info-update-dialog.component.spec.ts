import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserInfoUpdateDialogComponent } from './user-info-update-dialog.component';

describe('UserInfoUpdateDialogComponent', () => {
  let component: UserInfoUpdateDialogComponent;
  let fixture: ComponentFixture<UserInfoUpdateDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserInfoUpdateDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserInfoUpdateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  //it('should create', () => {
  //  expect(component).toBeTruthy();
  //});
});
