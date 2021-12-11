import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {TrainingComponent} from './training/training.component';
import {CurrentTrainingComponent} from './training/current-training/current-training.component';
import {NewTrainingComponent} from './training/new-training/new-training.component';
import {PastTrainingComponent} from './training/past-training/past-training.component';
import {WelcomeComponent} from './welcome/welcome.component';
import {FormsModule} from "@angular/forms";
import {HeaderComponent} from './navigation/header/header.component';
import {SidenavListComponent} from './navigation/sidenav-list/sidenav-list.component';
import {StopTrainingComponent} from "./training/current-training/stop-training.component";
import {AuthService} from "./auth/auth.service";
import {AuthModule} from "./auth/auth.module";
import {TrainingService} from "./training/training.service";
import {HttpClientModule} from "@angular/common/http";
import {JwtModule} from "@auth0/angular-jwt";
import {AuthGuard} from "./auth/auth.guard";
import {UIService} from "./shared/ui.service";
import {SharedModule} from "./shared/shared.module";

export function tokenGetter(): string | null {
    console.log("localStorage.getItem('access'): ")
    console.log(localStorage.getItem('access'))
    return localStorage.getItem('access');
}

@NgModule({
    declarations: [
        AppComponent,

        TrainingComponent,
        CurrentTrainingComponent,
        NewTrainingComponent,
        PastTrainingComponent,
        WelcomeComponent,
        HeaderComponent,
        SidenavListComponent,
        StopTrainingComponent
    ],
    imports: [

        JwtModule.forRoot(
            {
                config:
                    {
                        tokenGetter,
                        allowedDomains: [
                            'localhost:4200',
                            'localhost:8000',
                            // environment.host
                        ],
                        disallowedRoutes: [
                            "http://localhost:8000/api/user/create/"
                        ],
                        skipWhenExpired: false,
                        // throwNoTokenError: true
                    }
            }
        ),

        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        SharedModule,
        FormsModule,
        AuthModule,
    ],
    providers: [
        AuthService,
        AuthGuard,
        TrainingService,
        UIService
    ],
    bootstrap: [AppComponent],
    entryComponents: [StopTrainingComponent]
})
export class AppModule {
}
