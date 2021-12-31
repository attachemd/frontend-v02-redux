import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {AuthService} from 'src/app/auth/auth.service';
import {Subscription} from "rxjs";

@Component({
    selector: 'app-sidenav-list',
    templateUrl: './sidenav-list.component.html',
    styleUrls: ['./sidenav-list.component.css']
})
export class SidenavListComponent implements OnInit, OnDestroy {
    @Output()
    public closeSideNav: EventEmitter<void> = new EventEmitter<void>();
    public isAuth: boolean = false;
    public authSubscription: Subscription = new Subscription();

    constructor(private authService: AuthService) {
    }

    ngOnInit(): void {
        this.authSubscription = this.authService
            .getAuthChange()
            .subscribe(
                (authStats) => {
                    this.isAuth = authStats;
                },
                (error) => {
                    console.log('error :', error)
                }
            )
    }

    onLogout(): void {
        this.authService.logout();
        this.onClose();
    }

    onClose() {
        this.closeSideNav.emit()
    }

    ngOnDestroy() {
        this.authSubscription.unsubscribe();
    }

}
