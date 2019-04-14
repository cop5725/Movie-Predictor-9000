import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Movie } from '../movie';
import { MovieService } from '../movie.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
    movies: Movie[] = [];

    constructor(private movieService: MovieService, private router: Router) { }

    ngOnInit() {
        this.getMovies();
    }

    getMovies(): void {
        this.movieService.getMovies()
            .subscribe(movies => this.movies = movies.slice(0, 12));
    }

    routeToMovieDetail(movie: Movie): void {
      if(movie) {
        console.log(movie);
        this.router.navigateByUrl('/detail/' + movie.movieid);
      }
    }
}