import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmilleyComponent } from './smilley.component';

describe('SmilleyComponent', () => {
  let component: SmilleyComponent;
  let fixture: ComponentFixture<SmilleyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmilleyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmilleyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
