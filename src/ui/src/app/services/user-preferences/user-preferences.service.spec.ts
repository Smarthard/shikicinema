import { TestBed } from '@angular/core/testing';

import { UserPreferencesService } from './user-preferences.service';

describe('UserPreferencesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserPreferencesService = TestBed.get(UserPreferencesService);
    expect(service).toBeTruthy();
  });
});
