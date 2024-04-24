import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FranchiseListComponent } from './franchise-list.component';

describe('FranchiseListComponent', () => {
  let component: FranchiseListComponent;
  let fixture: ComponentFixture<FranchiseListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FranchiseListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FranchiseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
