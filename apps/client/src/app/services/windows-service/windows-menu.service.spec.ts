import { TestBed } from '@angular/core/testing';

import { WindowsMenuService } from './windows-menu.service';

describe('WindowsMenuService', () => {
  let service: WindowsMenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WindowsMenuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
