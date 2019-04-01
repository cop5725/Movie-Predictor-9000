import { TestBed, inject } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';

import { GenreService } from './genre.service';

describe('GenreService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterModule, HttpModule],
            providers: [GenreService]
        });
    });

    it('should be created', inject([GenreService], (service: GenreService) => {
        expect(service).toBeTruthy();
    }));
});
