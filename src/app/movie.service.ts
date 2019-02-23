import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { Http } from '@angular/http';
import { map } from "rxjs/operators";

import { Movie } from './movie';

@Injectable({ providedIn: 'root' })
export class MovieService {

    result: any;
    constructor(private _http: Http) { }

    getMovies(): Observable<Movie[]> {
        return this._http.get("/api/movies")
            .pipe(map(result => this.result = result.json().data));
    }
}
