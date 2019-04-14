import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { MatTableDataSource, MatPaginator, MatRadioChange } from '@angular/material';

import { PersonService } from '../person.service';
import { Person } from '../person';
import { Movie } from '../movie';
import { debounceTime, switchMap, distinctUntilChanged, startWith } from 'rxjs/operators';
import { of, Subject } from 'rxjs';
import { FormControl } from '@angular/forms';

export interface Trend {
  value: number;
  period: string;
}

export interface Pairing {
  fullname: string;
  pid: number;
  total_rev: number;
  num_movies: number;
}

@Component({
  selector: 'app-person-profile',
  templateUrl: './person-profile.component.html',
  styleUrls: ['./person-profile.component.css']
})
export class PersonProfileComponent implements OnInit {

  person: Person;
  selectedPairing: Pairing;
  // topMovies: Movie[];
  topMoviesColumns: string[];
  topMovies = new MatTableDataSource<Movie>([]);
  successfulPairingsColumns = ['fullname', 'total_rev', 'num_movies'];
  successfulPairings = new MatTableDataSource<Pairing>([]);
  moviesWithSelectedPairing = new MatTableDataSource<Movie>([]);
  topMoviesCriteria = 'popularity';
  trendCriteria = 'popularity';
  trendChart = {
    type: 'line',
    data: [{ data: [], label: '', fill: false }],
    // data: [],
    labels: [],
    labelSet: new Set(),
    count: 0,
    legend: true,
    options: {
      title: {
        display: true,
        text: 'Trends'
      },
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            callback: function(value, index, values) {
              return value.toLocaleString('en', { useGrouping: true });
            }
          }
        }]
      },
      scaleShowVerticalLines: true,
      responsive: true
    },
    form: {
      searchInput: new FormControl(),
      filteredOptions: []
    }
  };
  genresChart = {
    type: 'radar',
    data: [{ data: [], label: '', fill: true }],
    labels: [],
    legend: true,
    options: {
      title: {
        display: true,
        text: 'Top Genres'
      },
      scaleShowVerticalLines: true,
      responsive: true,
      scale: {
        ticks: {
          beginAtZero: true
        }
      }
    }
  };
  @Input() chartFilters = {
    filter: false,
    gender: '',
    ageu: 100,
    agel: 0,
    changed: new Subject<string>()
  };
  chartColors = {
    red: 'rgb(255, 99, 132)',
    orange: 'rgb(255, 159, 64)',
    yellow: 'rgb(255, 205, 86)',
    green: 'rgb(75, 192, 192)',
    blue: 'rgb(54, 162, 235)',
    purple: 'rgb(153, 102, 255)',
    grey: 'rgb(201, 203, 207)'
  };

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private personService: PersonService
  ) { }

  ngOnInit() {
    this.person = { personid: -1, fullname: '', gender: '' };
    this.getPerson();
    this.getFilteredOptions();
  }

  getPerson(): void {
    this.personService
      .getPersonById(this.route.snapshot.paramMap.get('id'))
      .toPromise()
      .then(person => {
        this.person = person;
        this.getGenresData();
        this.getTopMovies();
        this.getPopularityTrend(this.person.personid);
        this.getSuccessfulPairings();
      });
  }

  getTopMovies(): void {
    this.personService
      .getTopMovies(this.person.personid.toString(), this.topMoviesCriteria)
      .toPromise()
      .then(movies => {
        // this.topMovies = movies;
        this.topMovies.data = movies;
        this.topMovies.paginator = this.paginator;
        this.updateTopMoviesColumns();
      });
  }

  getPopularityTrend(id: number): void {
    this.personService
      .getPopularityTrend(id.toString(), this.trendCriteria, this.chartFilters)
      .toPromise()
      .then(trend => {
        this.setTrendData(trend);
      });
  }

  getGenresData(): void {
    this.personService
      .getGenresData(this.person.personid.toString())
      .toPromise()
      .then(genres => {
        genres.forEach((dataPoint) => {
          this.genresChart.data[0]['data'].push(dataPoint.popularity);
          this.genresChart.data[0]['label'] = 'popularity';
          this.genresChart.labels.push(dataPoint.name);
        });
      });
  }

  getSuccessfulPairings(): void {
    this.personService
      .getSuccessfulPairings(this.person.personid.toString())
      .toPromise()
      .then(pairings => {
        this.successfulPairings.data = pairings;
      });
  }

  getMoviesWithSelectedPairing(): void {
    this.personService
      .getMoviesWithSelectedPairing(this.person.personid.toString(), this.selectedPairing.pid.toString())
      .toPromise()
      .then(pairings => {
        this.moviesWithSelectedPairing.data = pairings;
      });
  }

  updateTopMoviesColumns(): void {
    if (this.topMoviesCriteria === 'rating') {
      this.topMoviesColumns = ['title', 'role', 'avg_rating', 'releasedate'];
    } else if (this.topMoviesCriteria === 'revenue') {
      this.topMoviesColumns = ['title', 'role', 'revenue', 'releasedate'];
    } else {
      this.topMoviesColumns = ['title', 'role', 'releasedate'];
    }
  }

  changeTopMoviesCriteria($event: MatRadioChange): void {
    this.topMoviesCriteria = $event.value;
    this.topMoviesColumns = [];
    this.getTopMovies();
  }

  changeTrendCriteria($event: MatRadioChange): void {
    this.trendCriteria = $event.value;
    this.updateTrendChart();
  }

  changeGenderFilter($event: MatRadioChange): void {
    this.chartFilters.gender = $event.value;
  }

  changeSelectedPairing(row: Pairing): void {
    if (row) {
      this.selectedPairing = row;
      this.getMoviesWithSelectedPairing();
    }
  }

  // setTrendData(trend: Trend[]) {
  //   trend.forEach((dataPoint, index) => {
  //     this.trendChart.data[0]['data'].push(dataPoint.value);
  //     this.trendChart.labels.push(dataPoint.period);
  //   });
  // }

  updateTrendChart() {
    // this.trendChart.data[0]['data'] = [];
    this.trendChart.data = [];
    this.trendChart.labels = [];
    this.trendChart.labelSet.clear();
    this.trendChart.count = 0;
    this.getPopularityTrend(this.person.personid);
  }

  setTrendData(trend: Trend[]) {
    const count = this.trendChart.count;
    const colorNames = Object.keys(this.chartColors);
    const colorName = colorNames[count % colorNames.length];
    const newDataSet = {
      data: [],
      label: '',
      fill: false,
      periods: [],
      backgroundColor: this.chartColors[colorName],
      borderColor: this.chartColors[colorName]
    };

    newDataSet.label =
      count === 0 ? this.person.fullname : this.trendChart.form.searchInput.value.fullname;

    this.trendChart.data[count] = newDataSet;
    trend.forEach((dataPoint) => {
      this.trendChart.data[count]['data'].push(dataPoint.value);
      this.trendChart.data[count]['periods'].push(dataPoint.period);
      if (!this.trendChart.labelSet.has(dataPoint.period)) {
        this.trendChart.labels.push(dataPoint.period);
        this.trendChart.labelSet.add(dataPoint.period);
      }
    });
    this.trendChart.labels.sort((a, b) => a.localeCompare(b));

    const BreakException = {};

    this.trendChart.data
      .forEach((dataSet) => {
        const earliest = dataSet['periods'][0];
        try {
          this.trendChart.labels.forEach((period) => {
            if (period === earliest) { throw BreakException; }
            dataSet['periods'].push(period);
            dataSet['data'].unshift(null);
          });
        } catch (e) { }
        dataSet['periods'].sort((a, b) => a.localeCompare(b));
      });
    this.trendChart.count += 1;
  }

  routeToMovieDetail(row): void {
    if (row) {
      console.log(row);
      this.router.navigateByUrl('/detail/' + row.movieid);
    }
  }

  getFilteredOptions() {
    this.trendChart.form.searchInput.valueChanges
      .pipe(
        startWith(''),
        debounceTime(300),
        switchMap(name => this.personService.getPersons({ name: name }))
      ).subscribe(options => this.trendChart.form.filteredOptions = <any[]>options);
  }

  displayFn(person?: Person): string | undefined {
    return person ? person.fullname : undefined;
  }

  addDataSet() {
    if (this.trendChart.form.searchInput.value) {
      this.getPopularityTrend(this.trendChart.form.searchInput.value.personid);
    }
  }
}
