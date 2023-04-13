import { TestBed } from '@angular/core/testing';

import { RoleAttributionGuard } from './role-attribution.guard';

describe('RoleAttributionGuard', () => {
  let guard: RoleAttributionGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(RoleAttributionGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
