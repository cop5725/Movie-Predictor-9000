import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { Http } from '@angular/http';
import { map } from "rxjs/operators";

import { Actor } from './actor';

@Injectable({ providedIn: 'root' })
export class ActorService {

    result: any;
    constructor(private _http: Http) { }

    getActors(name): Observable<Actor[]> {
        return this._http.get("/api/actors", { params: { "actorName": name } })
            .pipe(map(result => this.result = result.json().data));
    }
}