import { TestBed } from '@angular/core/testing';

import { AuthcarrierGuard } from './authcarrier.guard';

describe('AuthcarrierGuard', () => {
  let guard: AuthcarrierGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AuthcarrierGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
