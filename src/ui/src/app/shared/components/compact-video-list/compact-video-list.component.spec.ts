import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompactVideoListComponent } from './compact-video-list.component';

describe('CompactVideoListComponent', () => {
  let component: CompactVideoListComponent;
  let fixture: ComponentFixture<CompactVideoListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompactVideoListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompactVideoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
