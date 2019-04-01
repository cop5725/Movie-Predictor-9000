import { TestBed, inject } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';

import { DirectorService } from './director.service';

describe('DirectorService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterModule, HttpModule],
            providers: [DirectorService]
        });
    });

    it('should be created', inject([DirectorService], (service: DirectorService) => {
        expect(service).toBeTruthy();
    }));
});
