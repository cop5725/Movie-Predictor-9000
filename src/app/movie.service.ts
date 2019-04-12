import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { Http } from '@angular/http';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from "rxjs/operators";

import { Movie } from './movie';

@Injectable({ providedIn: 'root' })
export class MovieService {

  result: any;
  constructor(private _http: Http, private httpClient: HttpClient) { }

  getMovies(): Observable<Movie[]> {
    return this._http.get("/api/movies")
      .pipe(map(result => this.result = result.json().data));
  }

  getMovie(id: string): Observable<Movie> {
    const options = { params: new HttpParams().set('id', id) };
    return this.httpClient.get('/api/movie/detail', options)
      .pipe(
        map(response => response['data'][0])
      );
  }

  getSimilarMovies(id: string): Observable<Movie[]> {
    const options = { params: new HttpParams().set('id', id) };
    return this.httpClient.get('/api/movie/similar', options)
      .pipe(
        map(response => response['data'])
      );
  }
}
