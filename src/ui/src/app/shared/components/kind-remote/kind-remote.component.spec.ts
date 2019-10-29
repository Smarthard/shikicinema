import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KindRemoteComponent } from './kind-remote.component';

describe('KindRemoteComponent', () => {
  let component: KindRemoteComponent;
  let fixture: ComponentFixture<KindRemoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KindRemoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KindRemoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
