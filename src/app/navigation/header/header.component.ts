import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {AuthService} from 'src/app/auth/auth.service';
import {Subscription} from "rxjs";
import {ManagePeriodicTokenRefresh} from "../../auth/periodic-token-refresh.service";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
    @Output()
    public sidenavToggle: EventEmitter<void> = new EventEmitter<void>();
    public isAuthenticated: boolean = false;
    public authSubscription: Subscription = new Subscription();

    constructor(
        private authService: AuthService,
        private managePeriodicTokenRefresh: ManagePeriodicTokenRefresh,
    ) {
    }

    ngOnInit(): void {
        this.authSubscription = this.authService
            .getAuthChange()
            .subscribe(
                (authStats) => {
                    if(authStats){
                        this.managePeriodicTokenRefresh.initPeriodicRefresh();
                    }
                    console.log(
                        '%c this.isAuthenticated ',
                        'background: yellow; color: #000; padding: 0 10px;'
                    );
                    console.log("authStats: ", authStats)
                    this.isAuthenticated = authStats;
                },
                (error) => {
                    console.log('error :', error)
                }
            )
    }

    onToggleSidenav() {
        this.sidenavToggle.emit();
    }

    onLogout(): void {
        this.authService.logout()
    }

    ngOnDestroy() {
        this.authSubscription.unsubscribe();
    }

}
