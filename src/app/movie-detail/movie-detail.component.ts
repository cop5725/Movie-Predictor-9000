import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Movie } from '../movie';
import { MovieService } from '../movie.service';

@Component({
    selector: 'app-movie-detail',
    templateUrl: './movie-detail.component.html',
    styleUrls: ['./movie-detail.component.css']
})
export class MovieDetailComponent implements OnInit {
    movie: Movie;

    constructor(
        private route: ActivatedRoute,
        private movieService: MovieService,
        private location: Location
    ) { }

    ngOnInit(): void {
    }

    // getMovie(): void {
    //     const id = String(this.route.snapshot.paramMap.get('id'));
    //     this.movieService.getMovie(id)
    //         .subscribe(movie => {
    //             this.movie = movie;
    //         });
    // }

    goBack(): void {
        this.location.back();
    }
}