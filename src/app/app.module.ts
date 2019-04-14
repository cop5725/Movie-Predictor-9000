import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { RouteReuseStrategy } from '@angular/router';
import { ChartsModule } from 'ng2-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatProgressSpinnerModule, MatRadioModule, MatPaginatorModule, MatCardModule, MatDatepickerModule, MatNativeDateModule, MatAutocompleteModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatTableModule, MatCheckboxModule } from '@angular/material';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './/app-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MovieDetailComponent } from './movie-detail/movie-detail.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { PersonProfileComponent } from './person-profile/person-profile.component';
import { CustomRouteReuseStrategy } from './custom-route-reuse.strategy';
import { PredictiveAnalyticsComponent } from './predictive-analytics/predictive-analytics.component';
import { GenreDetailComponent } from './genre-detail/genre-detail.component';

@NgModule({
    declarations: [
        AppComponent,
        MovieDetailComponent,
        DashboardComponent,
        SearchBarComponent,
        PersonProfileComponent,
        PredictiveAnalyticsComponent,
        GenreDetailComponent,
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        AppRoutingModule,
        HttpClientModule,
        BrowserAnimationsModule,
        MatCardModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatAutocompleteModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatTableModule,
        MatPaginatorModule,
        MatRadioModule,
        MatCheckboxModule,
        ChartsModule,
        MatProgressSpinnerModule
    ],
    providers: [
        MatDatepickerModule,
      {
        provide: RouteReuseStrategy,
        useClass: CustomRouteReuseStrategy
      }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
