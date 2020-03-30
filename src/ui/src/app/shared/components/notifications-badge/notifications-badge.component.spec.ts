import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationsBadgeComponent } from './notifications-badge.component';

describe('NotificationsBadgeComponent', () => {
  let component: NotificationsBadgeComponent;
  let fixture: ComponentFixture<NotificationsBadgeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationsBadgeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationsBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
