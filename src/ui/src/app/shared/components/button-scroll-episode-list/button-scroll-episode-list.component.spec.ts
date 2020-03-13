import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonScrollEpisodeListComponent } from './button-scroll-episode-list.component';

describe('ButtonScrollEpisodeListComponent', () => {
  let component: ButtonScrollEpisodeListComponent;
  let fixture: ComponentFixture<ButtonScrollEpisodeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ButtonScrollEpisodeListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonScrollEpisodeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
