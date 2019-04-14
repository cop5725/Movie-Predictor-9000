import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { MovieDetailComponent } from './movie-detail/movie-detail.component';
import { PersonProfileComponent } from './person-profile/person-profile.component';
import { PredictiveAnalyticsComponent } from './predictive-analytics/predictive-analytics.component';
import { GenreDetailComponent } from './genre-detail/genre-detail.component';

const routes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'detail/:id', component: MovieDetailComponent },
    { path: 'person-profile/:id', component: PersonProfileComponent},
    { path: 'predict', component: PredictiveAnalyticsComponent },
    { path: 'genres', component: GenreDetailComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }