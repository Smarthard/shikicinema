import { TestBed } from '@angular/core/testing';

import { KodikService } from './kodik.service';

describe('KodikService', () => {
  let service: KodikService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KodikService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
