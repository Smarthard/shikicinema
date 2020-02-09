import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestDialogComponent } from './request-dialog.component';

describe('RequestDialogComponent', () => {
  let component: RequestDialogComponent;
  let fixture: ComponentFixture<RequestDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
