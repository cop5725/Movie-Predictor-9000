import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith, switchMap, debounceTime } from 'rxjs/operators';

import { Prediction } from '../prediction';
import { PredictService } from '../predict.service';

import { Genre } from '../genre';
import { GenreService } from '../genre.service';

import { Person } from '../person';
import { PersonService } from '../person.service';

@Component({
    selector: 'app-predictive-analytics',
    templateUrl: './predictive-analytics.component.html',
    styleUrls: ['./predictive-analytics.component.css']
})
export class PredictiveAnalyticsComponent implements OnInit {
    prediction: Prediction = new Prediction();

    selectedGenre = new FormControl()
    genres: Genre[] = [];
    filteredGenres: Observable<Genre[]>;

    selectedActor = new FormControl()
    filteredActors: Person[];

    selectedDirector = new FormControl()
    filteredDirector: Person[];

    selectedDate = new FormControl(new Date())

    constructor(
        private predictService: PredictService,
        private genreService: GenreService,
        private personService: PersonService,
    ) { }

    ngOnInit() {
        this.prediction.expected_revenue = 0;
        this.getFilteredOptions();
        this.getGenres();
        this.filteredGenres = this.selectedGenre.valueChanges
            .pipe(
                startWith(''),
                map(value => this._filterGenres(value, 'name'))
            );
    }

    getPrediction(): void {
        this.predictService.getPrediction(this.selectedGenre.value, this.selectedActor.value, this.selectedDirector.value, this.selectedDate.value.getMonth())
            .subscribe(prediction => //this.prediction.expected_revenue = prediction[0]['expected_return']
                {
                this.prediction.expected_revenue = prediction[0]['expected_return'];
                this.prediction.suggested_actor = prediction[0]['suggested_actor'];
                this.prediction.suggested_director = prediction[0]['suggested_director'];
                this.prediction.suggested_month = prediction[0]['suggested_date_month'];
            }
            );
    }

    getFilteredOptions() {
        this.selectedActor.valueChanges
            .pipe(
                startWith(''),
                debounceTime(300),
                switchMap(name => this.personService.getPersons({ name: name }))
            ).subscribe(options => this.filteredActors = options);
        this.selectedDirector.valueChanges
            .pipe(
                startWith(''),
                debounceTime(300),
                switchMap(name => this.personService.getPersons({ name: name }))
            ).subscribe(options => this.filteredDirector = options);
    }

    getGenres(): void {
        this.genreService.getGenres()
            .subscribe(genres => this.genres = genres);
    }

    private _filterGenres(value: string, field: string): Genre[] {
        const filterValue = value.toLowerCase();

        return this.genres.filter(option => option[field].toLowerCase().indexOf(filterValue) === 0);
    }

    displayFn(person?: Person): string | undefined {
        return person ? person.fullname : undefined;
    }
}
