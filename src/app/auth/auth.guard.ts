import {Injectable} from "@angular/core";
import {
    ActivatedRouteSnapshot,
    CanActivate,
    Router,
    RouterStateSnapshot, UrlTree
} from "@angular/router";
import {AuthService} from "./auth.service";
import {Observable, of} from "rxjs";

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
        | UrlTree
    {
        console.log("this.authService.isAuth(): ")
        console.log(this.authService.isAuth());
        if (this.authService.isAuth()) {
            this.authService.authStateChange.next();
            return of(true);
            // return true;
        } else {
            // this.router.navigate(['/login']);
            return of(true);
            // return false;
        }
    }
}
