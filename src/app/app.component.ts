import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';

// import {ManagePeriodicTokenRefresh} from "./auth/manage-periodic-token-refresh.service";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
    title = 'frontend-v02';

    constructor() {} // private managePeriodicTokenRefresh: ManagePeriodicTokenRefresh // private authService: AuthService,

    ngOnInit() {
        console.log(
            '%c AppComponent ',
            'background: red; color: #fff; padding: 0 10px;'
        );
        // this.managePeriodicTokenRefresh.initPeriodicRefresh();
        // this.authService.initAuthListener();
        // this.authService.authStateChange.subscribe(this.authService.authState);
    }
}
