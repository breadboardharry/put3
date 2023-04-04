import { TestBed } from '@angular/core/testing';

import { HitboxService } from './hitbox.service';

describe('HitboxService', () => {
  let service: HitboxService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HitboxService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
