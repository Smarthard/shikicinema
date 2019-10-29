import { TestBed } from '@angular/core/testing';

import { ShikivideosService } from './shikivideos.service';

describe('ShikivideosService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ShikivideosService = TestBed.get(ShikivideosService);
    expect(service).toBeTruthy();
  });
});
