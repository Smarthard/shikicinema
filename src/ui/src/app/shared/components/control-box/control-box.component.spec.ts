import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlBoxComponent } from './control-box.component';

describe('ControlBoxComponent', () => {
  let component: ControlBoxComponent;
  let fixture: ComponentFixture<ControlBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControlBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
