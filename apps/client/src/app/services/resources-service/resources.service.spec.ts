import { TestBed } from '@angular/core/testing';

import { MediaService } from './resources.service';

describe('ResourcesService', () => {
  let service: MediaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MediaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
