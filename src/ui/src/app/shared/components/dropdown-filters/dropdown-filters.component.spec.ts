import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownFiltersComponent } from './dropdown-filters.component';

describe('DropdownFiltersComponent', () => {
  let component: DropdownFiltersComponent;
  let fixture: ComponentFixture<DropdownFiltersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DropdownFiltersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DropdownFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
