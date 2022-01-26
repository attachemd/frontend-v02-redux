import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';


import {WelcomeComponent} from './welcome/welcome.component';
import {FormsModule} from "@angular/forms";
import {HeaderComponent} from './navigation/header/header.component';
import {SidenavListComponent} from './navigation/sidenav-list/sidenav-list.component';

import {AuthService} from "./auth/auth.service";
import {AuthModule} from "./auth/auth.module";
import {TrainingService} from "./training/training.service";
import {HttpClientModule} from "@angular/common/http";

import {AuthGuard} from "./auth/auth.guard";
import {UIService} from "./shared/ui.service";
import {SharedModule} from "./shared/shared.module";
import {JwtModule} from "@auth0/angular-jwt";
import {ManagePeriodicTokenRefresh} from "./auth/periodic-token-refresh.service";
import {FullCalendarComponent} from './full-calendar/full-calendar.component';
import {EventComponent} from './full-calendar/event/event.component';
import {EventDayGridMonthComponent} from './full-calendar/event-day-grid-month/event-day-grid-month.component';
import {StoreModule} from "@ngrx/store";
import {reducers} from "./app.reducer";

// import { FullCalendarModule } from '@fullcalendar/angular';
// import interactionPlugin from '@fullcalendar/interaction';
// import dayGridPlugin from '@fullcalendar/daygrid';
//
// FullCalendarModule.registerPlugins([
//     interactionPlugin,
//     dayGridPlugin
// ]);


export function tokenGetter(): string | null {
    // console.log(
    //     '%c localStorage.getItem(access): ',
    //     'background: white; ' +
    //     'color: #000; ' +
    //     'padding: 10px; ' +
    //     'border: 1px solid red'
    // );
    // console.log(localStorage.getItem('access'))
    return localStorage.getItem('access');
}

@NgModule({
    declarations: [
        AppComponent,


        WelcomeComponent,
        HeaderComponent,
        SidenavListComponent,
        FullCalendarComponent,
        EventComponent,
        EventDayGridMonthComponent,

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

        // FullCalendarModule,

        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        SharedModule,
        FormsModule,
        AuthModule,
        StoreModule.forRoot(reducers)
        // TrainingModule
    ],
    providers: [
        ManagePeriodicTokenRefresh,
        AuthService,
        AuthGuard,
        TrainingService,
        UIService
    ],
    entryComponents: [EventComponent, EventDayGridMonthComponent],
    bootstrap: [AppComponent],

})
export class AppModule {
}
