import { TestBed } from '@angular/core/testing';

import { VideosService } from './videos.service';

describe('VideosService', () => {
  let service: VideosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VideosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
