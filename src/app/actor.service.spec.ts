import { TestBed, inject } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';

import { ActorService } from './actor.service';

describe('ActorService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterModule, HttpModule],
            providers: [ActorService]
        });
    });

    it('should be created', inject([ActorService], (service: ActorService) => {
        expect(service).toBeTruthy();
    }));
});
