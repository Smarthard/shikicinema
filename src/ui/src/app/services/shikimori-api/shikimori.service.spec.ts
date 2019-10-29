import { TestBed } from '@angular/core/testing';

import { ShikimoriService } from './shikimori.service';

describe('ShikimoriService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ShikimoriService = TestBed.get(ShikimoriService);
    expect(service).toBeTruthy();
  });
});
