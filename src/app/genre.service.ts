import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { Http } from '@angular/http';
import { map } from "rxjs/operators";

import { Genre } from './genre';

@Injectable({ providedIn: 'root' })
export class GenreService {

    result: any;
    constructor(private _http: Http) { }

    getGenres(): Observable<Genre[]> {
        return this._http.get("/api/genres")
            .pipe(map(result => this.result = result.json().data));
    }
}