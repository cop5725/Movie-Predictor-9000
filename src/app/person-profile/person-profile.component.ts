import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { MatTableDataSource, MatPaginator, MatRadioChange } from '@angular/material';

import { PersonService } from '../person.service';
import { Person } from '../person';
import { Movie } from '../movie';

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
    labels: [],
    legend: true,
    options: {
      scaleShowVerticalLines: true,
      responsive: true
    }
  };
  genresChart = {
    type: 'radar',
    data: [{ data: [], label: '', fill: true, count: 0 }],
    labels: [],
    legend: true,
    options: {
      scaleShowVerticalLines: true,
      responsive: true,
      scale: {
        ticks: {
          beginAtZero: true
        }
      }
    }
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
  }

  getPerson(): void {
    this.personService
      .getPersonById(this.route.snapshot.paramMap.get('id'))
      .toPromise()
      .then(person => {
        this.person = person;
        this.getGenresData();
        this.getTopMovies();
        this.getPopularityTrend();
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

  getPopularityTrend(): void {
    this.personService
      .getPopularityTrend(this.person.personid.toString(), this.trendCriteria)
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
    this.trendChart.data[0]['data'] = [];
    this.trendChart.labels = [];
    this.getPopularityTrend();
  }

  changeSelectedPairing(row: Pairing): void {
    if (row) {
      this.selectedPairing = row;
      this.getMoviesWithSelectedPairing();
    }
  }

  setTrendData(trend: Trend[]) {
    trend.forEach((dataPoint, index) => {
      this.trendChart.data[0]['data'].push(dataPoint.value);
      this.trendChart.labels.push(dataPoint.period);
    });
  }

  // setTrendData(trend: Trend[]) {
  //   this.trendChart.data[this.trendChart.count] = { data: [], labels: '', fill: false };
  //   console.log('count: ' + this.trendChart.count);
  //   console.log('data: ' + this.trendChart.data[0]);
  //   trend.forEach((dataPoint, index) => {
  //     this.trendChart.data[this.trendChart.count]['data'].push(dataPoint.value);
  //     if (!this.trendChart.labelSet.has(dataPoint.period)) {
  //       this.trendChart.labels.push(dataPoint.period);
  //     }
  //   });
  //   this.trendChart.count++;
  // }

  routeToMovieDetail(row): void {
    if (row) {
      console.log(row);
      this.router.navigateByUrl('/detail/' + row.movieid);
    }
  }
}
