import { TestBed } from '@angular/core/testing';

import { FoolService } from './fool.service';

describe('FoolService', () => {
    let service: FoolService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(FoolService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
