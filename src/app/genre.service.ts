import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { Http } from '@angular/http';
import { map } from "rxjs/operators";

import { Genre } from './genre';
import { HttpClient } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
import { Trend } from './genre-detail/genre-detail.component';

@Injectable({ providedIn: 'root' })
export class GenreService {

    result: any;
    constructor(private _http: Http, private httpClient: HttpClient) { }

    getGenres(): Observable<Genre[]> {
        return this._http.get("/api/genres")
            .pipe(map(result => this.result = result.json().data));
    }

    getDeltaTrend(): Observable<Trend[]> {
      return this.httpClient.get('api/genres/delta', {})
        .pipe(
          map(response => response['data'])
        );
    }

    getMonthlyTrend(filter: {name: string}): Observable<Trend[]> {
      const options = { params: new HttpParams().set('name', filter.name) };
      return this.httpClient.get('api/genre/monthly', options)
        .pipe(
          map(response => response['data'])
        );
    }

}
