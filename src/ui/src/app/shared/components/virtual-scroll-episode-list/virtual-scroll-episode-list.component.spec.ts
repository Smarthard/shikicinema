import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VirtualScrollEpisodeListComponent } from './virtual-scroll-episode-list.component';

describe('VirtualScrollEpisodeListComponent', () => {
  let component: VirtualScrollEpisodeListComponent;
  let fixture: ComponentFixture<VirtualScrollEpisodeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VirtualScrollEpisodeListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VirtualScrollEpisodeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
