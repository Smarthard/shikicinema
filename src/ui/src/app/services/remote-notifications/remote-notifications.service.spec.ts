import { TestBed } from '@angular/core/testing';

import { RemoteNotificationsService } from './remote-notifications.service';

describe('RemoteNotificationsService', () => {
  let service: RemoteNotificationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RemoteNotificationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
