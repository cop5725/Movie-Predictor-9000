import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { Http } from '@angular/http';
import { map } from "rxjs/operators";

import { Prediction } from './prediction';

@Injectable({ providedIn: 'root' })
export class PredictService {

    result: any;
    constructor(private _http: Http) { }

    getPrediction(genreName: string, actorName: string, directorName: string, releaseMonth: number): Observable<Prediction> {
        if (!genreName) {
            return;
        }
        if (!actorName) {
            return;
        }
        if (!directorName) {
            return;
        }
        if (!releaseMonth) {
            return;
        }

        return this._http.get("/api/predict", { params: { "genreName": genreName, "actorName": actorName, "directorName": directorName, "releaseMonth": releaseMonth + 1 } })
            .pipe(map(result => this.result = result.json().data));
    }
}
