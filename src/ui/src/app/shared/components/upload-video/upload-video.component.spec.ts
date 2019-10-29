import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadVideoComponent } from './upload-video.component';

describe('UploadVideoComponent', () => {
  let component: UploadVideoComponent;
  let fixture: ComponentFixture<UploadVideoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadVideoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
