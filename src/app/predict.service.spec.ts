import { TestBed, inject } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';

import { PredictService } from './predict.service';

describe('PredictService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterModule, HttpModule],
            providers: [PredictService]
        });
    });

    it('should be created', inject([PredictService], (service: PredictService) => {
        expect(service).toBeTruthy();
    }));
});
