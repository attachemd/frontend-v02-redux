import {Injectable} from "@angular/core";
import {
    ActivatedRouteSnapshot,
    CanActivate,
    Router,
    RouterStateSnapshot, UrlTree
} from "@angular/router";
import {AuthService} from "./auth.service";
import {Observable, of} from "rxjs";
import {catchError, concatMap, flatMap, map} from "rxjs/operators";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private authService: AuthService,
        private router: Router
    ) {
    }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ):
        | Observable<boolean | UrlTree>
        | Promise<boolean | UrlTree>
        | boolean
        | UrlTree {

        console.log(
            '%c this.authService.isAuth(): ',
            'background: white; ' +
            'color: #000; ' +
            'padding: 10px; ' +
            'border: 1px solid #47C0BE'
        );
        console.log(this.authService.isAuth());

        // if (this.authService.isAuth()) {
        //     this.authService.authStateChange.next();
        //     return of(true);
        //     // return true;
        // } else {
        //     // this.router.navigate(['/login']);
        //     return of(true);
        //     // return false;
        // }

        return this.authService
            .authState()
            .pipe(
                map(
                    (isAuth) => {
                        console.log("isAuth: ", isAuth);
                        if (isAuth) {
                            // this.authService.authStateChange.next();
                            console.log("this.authService.authChange");
                            this.authService.authChange.next(true);
                            return this.redirectToOther(state)
                            // return true;
                        } else {
                            console.log("!isAuth: ", isAuth);
                            // this.router.navigate(['/login']);
                            return this.redirectToEntry(state)
                            // return false;
                        }
                    }
                ),
                catchError(
                    (error) => {
                        console.log('from auth.guard.ts error: ', error);
                        this.router.navigate(['/login']);
                        return of(false);
                    }
                )
            )


    }

    redirectToEntry(state: RouterStateSnapshot): boolean {
        if (state.url.indexOf('/login') == -1 && state.url.indexOf('/signup') == -1) {
            // DOC: not logged in users only navigate to login page
            console.log(
                '%c redirectToEntry: false ',
                'background: #B8FF13; ' +
                'color: #000; ' +
                'padding: 10px; ' +
                'border: 1px solid #47C0BE'
            );
            this.router.navigate(['/login']);
            return false;
        } else {
            console.log(
                '%c redirectToEntry: true ',
                'background: #B8FF13; ' +
                'color: #000; ' +
                'padding: 10px; ' +
                'border: 1px solid #47C0BE'
            );
            return true;
        }
    }

    redirectToOther(state: RouterStateSnapshot): boolean {
        if (state.url.indexOf('/login') != -1 || state.url.indexOf('/signup') != -1) {
            console.log(
                '%c redirectToOther: false ',
                'background: #C1FEEA; ' +
                'color: #000; ' +
                'padding: 10px; ' +
                'border: 1px solid #47C0BE'
            );
            this.router.navigate(['/training']);
            return false;
        } else {
            console.log(
                '%c redirectToOther: true ',
                'background: #C1FEEA; ' +
                'color: #000; ' +
                'padding: 10px; ' +
                'border: 1px solid #47C0BE'
            );
            return true;
        }
    }
}
