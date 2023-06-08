import { TestBed } from '@angular/core/testing';

import { AliveGuard } from './alive.guard';

describe('AliveGuard', () => {
  let guard: AliveGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AliveGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
