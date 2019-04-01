import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { Http } from '@angular/http';
import { map } from "rxjs/operators";

import { Director } from './director';

@Injectable({ providedIn: 'root' })
export class DirectorService {

    result: any;
    constructor(private _http: Http) { }

    getDirectors(name: string): Observable<Director[]> {
        return this._http.get("/api/directors", { params: { "directorName": name } })

            .pipe(map(result => this.result = result.json().data));
    }
}