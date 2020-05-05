import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentBadgeComponent } from './comment-badge.component';

describe('CommentBadgeComponent', () => {
  let component: CommentBadgeComponent;
  let fixture: ComponentFixture<CommentBadgeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommentBadgeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
