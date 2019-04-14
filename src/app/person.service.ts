import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { Person } from './person';
import { Movie } from './movie';
import { Genre } from './genre';
import { Trend, Pairing } from './person-profile/person-profile.component';

@Injectable({
  providedIn: 'root'
})
export class PersonService {

  constructor(private http: HttpClient) { }

  getPersons(filter: { name: string }): Observable<Person[]> {
    if (!filter.name) {
      return of([]);
    }
    const options = { params: new HttpParams().set('name', filter.name) };
    return this.http.get('api/person', options)
      .pipe(
        map(response => response['data'])
      );
  }

  getPersonById(id: string): Observable<Person> {
    if (!id) {
      return of();
    }
    const options = { params: new HttpParams().set('id', id) };
    return this.http.get('api/person', options)
      .pipe(
        map(response => response['data'][0])
      );
  }

  getTopMovies(id: string, criteria: string): Observable<Movie[]> {
    if (!id) {
      return of();
    }
    const options = { params: new HttpParams().set('id', id).set('criteria', criteria) };
    return this.http.get('api/person/movies', options)
      .pipe(
        map(response => response['data'])
      );
  }

  getSuccessfulPairings(id: string): Observable<Pairing[]> {
    if (!id) {
      return of();
    }
    const options = { params: new HttpParams().set('id', id) };
    return this.http.get('api/person/pairings', options)
      .pipe(
        map(response => response['data'])
      );
  }

  getMoviesWithSelectedPairing(id: string, pairing: string): Observable<Movie[]> {
    if (!id) {
      return of();
    }
    const options = { params: new HttpParams().set('id', id).set('pairing', pairing) };
    return this.http.get('api/person/pairing/movies', options)
      .pipe(
        map(response => response['data'])
      );
  }

  getPopularityTrend(id: string, criteria: string, chartFilters): Observable<Trend[]> {
    if (!id) {
      return of();
    }
    const options = {
      params: new HttpParams()
        .set('id', id)
        .set('criteria', criteria)
        .set('filter', chartFilters.filter)
        .set('agel', chartFilters.agel)
        .set('ageu', chartFilters.ageu)
        .set('gender', chartFilters.gender)
    };
    return this.http.get('api/person/trends', options)
      .pipe(
        map(response => response['data'])
      );
  }

  getGenresData(id: string): Observable<Genre[]> {
    if (!id) {
      return of();
    }
    const options = { params: new HttpParams().set('id', id) };
    return this.http.get('api/person/genres', options)
      .pipe(
        map(response => response['data'])
      );
  }
}
