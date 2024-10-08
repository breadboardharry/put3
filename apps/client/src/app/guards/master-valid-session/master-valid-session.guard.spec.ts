import { TestBed } from '@angular/core/testing';

import { MasterValidSessionGuard } from './master-valid-session.guard';

describe('MasterValidSessionGuard', () => {
  let guard: MasterValidSessionGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(MasterValidSessionGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
