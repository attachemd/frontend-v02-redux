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
                            return true;
                            // return true;
                        } else {
                            console.log("!isAuth: ", isAuth);
                            this.router.navigate(['/login']);
                            return false;
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

        // return this.authService
        //     .authState()
        //     .pipe(
        //         flatMap(
        //             (isAuth) => {
        //                 console.log("isAuth: ", isAuth);
        //                 if (isAuth) {
        //                     // this.authService.authStateChange.next();
        //                     console.log("this.authService.authChange");
        //                     this.authService.authChange.next(true);
        //                     return of(true);
        //                     // return true;
        //                 } else {
        //                     console.log("!isAuth: ", isAuth);
        //                     this.router.navigate(['/login']);
        //                     return of(false);
        //                     // return false;
        //                 }
        //             }
        //         ),
        //         catchError(
        //             (error) => {
        //                 console.log('from auth.guard.ts error: ', error);
        //                 this.router.navigate(['/login']);
        //                 return of(false);
        //             }
        //         )
        //     )

        // return this.authService.test();

        // return this.authService
        //     .authState()
        //     .pipe(
        //         (isAuth) => {
        //             console.log("isAuth._isScalar: ", isAuth._isScalar);
        //             if (isAuth._isScalar) {
        //                 // this.authService.authStateChange.next();
        //                 console.log("this.authService.authChange");
        //                 this.authService.authChange.next(true);
        //                 return of(true);
        //                 // return true;
        //             } else {
        //                 console.log("!isAuth._isScalar: ", isAuth._isScalar);
        //                 this.router.navigate(['/login']);
        //                 return of(false);
        //                 // return false;
        //             }
        //         }
        //     )


        // let sub = this.authService
        //     .authState()
        //     .subscribe(
        //         (isAuth) => {
        //             // if (isAuth) {
        //             //     return of(true);
        //             // } else {
        //             //     return of(false);
        //             // }
        //             console.log("isAuth: ", isAuth);
        //             return isAuth;
        //         },
        //         (error)=>{
        //             console.log("error");
        //             console.log(error);
        //         }
        //     );
        // console.log("sub: ", sub)
        // if (sub) {
        //     // this.authService.authStateChange.next();
        //     console.log("this.authService.authChange");
        //     this.authService.authChange.next(true);
        //     return of(true);
        //     // return true;
        // } else {
        //     this.router.navigate(['/login']);
        //     return of(false);
        //     // return false;
        // }

    }
}
