import { Component, OnInit } from '@angular/core';
import { GenreService } from '../genre.service';
import { Genre } from '../genre';
import { ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

const chartColors = {
  red: 'rgb(255, 99, 132)',
  orange: 'rgb(255, 159, 64)',
  yellow: 'rgb(255, 205, 86)',
  green: 'rgb(75, 192, 192)',
  blue: 'rgb(54, 162, 235)',
  purple: 'rgb(153, 102, 255)',
  grey: 'rgb(201, 203, 207)'
};

export interface Trend {
  data: number;
  label: string;
}

@Component({
  selector: 'app-genre-detail',
  templateUrl: './genre-detail.component.html',
  styleUrls: ['./genre-detail.component.css']
})
export class GenreDetailComponent implements OnInit {

  // genre: Genre = new Genre();
  selectedGenre = new FormControl();
  genre: Genre;
  genres: Genre[] = [];
  filteredGenres: Observable<Genre[]>;

  deltaChart = {
    type: 'bar',
    legend: true,
    options: {
      title: {
        display: true,
        text: 'Delta'
      },
      scaleShowVerticalLines: false,
      responsive: true
    },
    labels: [],
    dataset: [{
      label: 'Delta',
      hoverBackgroundColor: chartColors.blue,
      backgroundColor: [],
      borderColor: [],
      borderWidth: 1,
      data: []
    }]
  };

  monthlyChart = {
    type: 'bar',
    legend: true,
    options: {
      title: {
        display: true,
        text: 'Monthly Average Performance over last 5 years'
      },
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            callback: function (value, index, values) {
              value = value.toLocaleString('en', { useGrouping: true });
              return '$' + value;
            }
          }
        }]
      },
      scaleShowVerticalLines: false,
      responsive: true,
    },
    labels: [],
    dataset: [{
      label: '',
      hoverBackgroundColor: chartColors.blue,
      backgroundColor: chartColors.purple,
      borderColor: chartColors.purple,
      borderWidth: 1,
      data: []
    }]
  };

  constructor(
    private genreService: GenreService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.getGenres();
    this.getDeltaTrend();
    this.filteredGenres = this.selectedGenre.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterGenres(value, 'name'))
      );
  }

  getDeltaTrend(): void {
    this.genreService
      .getDeltaTrend()
      .toPromise()
      .then(trend => this.setDeltaData(trend));
  }

  getMonthlyTrend(): void {
    this.genreService
      .getMonthlyTrend({ name: this.genre.name })
      .toPromise()
      .then(trend => this.setMonthlyData(trend));
  }

  setDeltaData(trend: Trend[]): void {
    trend.forEach((datapoint) => {
      this.deltaChart.labels.push(datapoint.label);
      this.deltaChart.dataset[0].data.push(datapoint.data);
      if (datapoint.data > 0) {
        this.deltaChart.dataset[0].backgroundColor.push(chartColors.green);
        this.deltaChart.dataset[0].borderColor.push(chartColors.green);
      } else {
        this.deltaChart.dataset[0].backgroundColor.push(chartColors.red);
        this.deltaChart.dataset[0].borderColor.push(chartColors.red);
      }
    });
  }

  setMonthlyData(trend: Trend[]): void {
    trend.forEach((datapoint) => {
      this.monthlyChart.labels.push(datapoint.label);
      this.monthlyChart.dataset[0].data.push(datapoint.data);
    });
  }

  getGenres(): void {
    this.genreService.getGenres()
      .subscribe(genres => this.genres = genres);
  }

  setGenre() {
    console.log('selected: ' + this.selectedGenre.value);
    this.genre = this.genres.filter((value) => value.name === this.selectedGenre.value)[0];

    if (this.genre) {
      this.monthlyChart.labels = [];
      this.monthlyChart.dataset[0].data = [];

      this.getMonthlyTrend();
    }
  }

  private _filterGenres(value: string, field: string): Genre[] {
    const filterValue = value.toLowerCase();

    return this.genres.filter(option => option[field].toLowerCase().indexOf(filterValue) === 0);
  }

}
