import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OldfagEpisodesListSkeletonComponent } from './oldfag-episodes-list-skeleton.component';

describe('OldfagEpisodesListSkeletonComponent', () => {
  let component: OldfagEpisodesListSkeletonComponent;
  let fixture: ComponentFixture<OldfagEpisodesListSkeletonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OldfagEpisodesListSkeletonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OldfagEpisodesListSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
