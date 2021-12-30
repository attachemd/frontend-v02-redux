import {User} from "./user.model";
import {AuthData} from "./auth-data.model";
import {Observable, of, Subject} from "rxjs";
import {Router} from "@angular/router";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {catchError, delay, map, tap} from "rxjs/operators";
import {JwtHelperService} from "@auth0/angular-jwt";
import {flatMap} from "rxjs/operators";
import {UIService} from "../shared/ui.service";
import { ManagePeriodicTokenRefresh } from "./manage-periodic-token-refresh.service";

// var LOG_PREFIX = new Date().getDate() + '.' + new Date().getMonth() + '.' + new Date().getFullYear() + ' / ' + new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds();
// var log = console.log;
//
// console.log = function(){
//
//     // 1. Convert args to a normal array
//     var args = Array.from(arguments);
//     // OR you can use: Array.prototype.slice.call( arguments );
//     let clean, index = undefined;
//     let caller_line = (new Error).stack?.split("\n")[4]
//     if(caller_line) {
//         index = caller_line.indexOf("at ");
//     }
//     if(caller_line && index) {
//         clean = caller_line.slice(index+2, caller_line.length);
//     }
//
//     // 2. Prepend log prefix log string
//     args.unshift(LOG_PREFIX + ": ");
//     if(clean){
//         args.unshift(clean + " ");
//     }
//
//     // 3. Pass along arguments to console.log
//     log.apply(console, args);
// }

// interface Data {
//     response: string,
//     id: number,
//     email: string,
//     token: {
//         refresh: string,
//         access: string
//     }
// }

interface Data {
    response: string,
    id: number,
    email: string,
    token?: object
}

@Injectable()
export class AuthService {

    authChange$: Subject<boolean> = new Subject<boolean>();
    private user: User = {
        email: "",
        userId: ""
    };
    private isAuthenticated = false;

    // authStateChange$: Subject<void> = new Subject<void>();

    constructor(
        private http: HttpClient,
        private router: Router,
        private jwtHelper: JwtHelperService,
        private uiService: UIService,
        private managePeriodicTokenRefresh: ManagePeriodicTokenRefresh
    ) {
    }

    public authChangeNotifier(isAuthenticated: boolean) {
        this.authChange$.next(isAuthenticated);
    }

    public registerUser(authData: AuthData): Observable<boolean>  {
        // this.user = {
        //     email: authData.email,
        //     userId: Math
        //         .round(Math.random() * 10000)
        //         .toString()
        // }
        // this.authSuccessfully()

        this.uiService.loadingStateNotifier(true);
        return this.http
            .post('api/user/create/', authData)
            .pipe(
                map(
                    (data: any) => {
                        this.uiService.loadingStateNotifier(false);
                        if (!data) {
                            return false;
                        } else if (data.token) {
                            console.log(
                                '%c localStorage.setItem ',
                                'background: red; color: #fff; padding: 10px;'
                            );
                            console.log("data")
                            console.log(data)

                            localStorage.setItem(
                                'access',
                                data.token.access
                            );

                            localStorage.setItem(
                                'refresh',
                                data.token.refresh
                            );
                            return true
                        }
                        throw {
                            error: {
                                detail: data.email[0]
                            }
                        };


                        // const decodedUser = this.jwtHelper
                        //     .decodeToken(data.token.access);
                        //
                        // localStorage.setItem(
                        //     'expiration',
                        //     decodedUser.exp
                        // );

                        // this.userInfo.next({
                        //     id: decodedUser.user_id,
                        //     username: login.username,
                        // });
                    }),
                catchError((error) => {
                    this.uiService.loadingStateNotifier(false);
                    console.log('error');
                    console.log(error);
                    this.uiService.showSnackBar(
                        error.error.detail,
                        undefined,
                        3000
                    );
                    return of(false);
                })
            )

    }

    public login(authData: AuthData): Observable<boolean> {
        // this.user = {
        //     email: authData.email,
        //     userId: Math
        //         .round(Math.random() * 10000)
        //         .toString()
        // }
        if (!(authData && authData.email && authData.password)) {
            console.log("no login!");
            return of(false);
        }

        this.uiService.loadingStateNotifier(true);
        return this.http
            .post('api/user/access/', authData)
            .pipe(
                map((data: any) => {
                    this.uiService.loadingStateNotifier(false);
                    if (!data) {
                        return false;
                    }
                    console.log(
                        '%c localStorage.setItem ',
                        'background: red; color: #fff; padding: 10px;'
                    );
                    console.log(data.access)
                    localStorage.setItem('access', data.access);
                    localStorage.setItem('refresh', data.refresh);
                    // const decodedUser = this.jwtHelper.decodeToken(data.access);
                    // localStorage.setItem('expiration', decodedUser.exp);

                    return true;
                }),
                catchError((error) => {
                    this.uiService.loadingStateNotifier(false);
                    console.log('error');
                    console.log(error);
                    this.uiService.showSnackBar(
                        error.error.detail,
                        undefined,
                        3000
                    );
                    return of(false);
                })
            )


    }

    public logout(): void {
        this.user = {
            email: "",
            userId: ""
        };
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        this.authChangeNotifier(false);
        this.router.navigate(['/login'])
    }

    // public getUser(): User {
    //     return {...this.user}
    // }

    // public initAuthListener(): void {
    //
    //
    //
    //     this.authStateChange$
    //         .pipe(
    //             flatMap(
    //                 () => {
    //                     console.log(
    //                         '%c isAccessToken ',
    //                         'background: green; color: #fff; padding: 0 10px;'
    //                     );
    //                     return this.isAccessToken() ? this.isBothTokensAlive() : of(false);
    //                 }
    //             )
    //         )
    //         .subscribe(
    //             isAuth => {
    //                 if (isAuth) {
    //                     this.isAuthenticated = true;
    //                     this.authChangeNotifier(true);
    //                     // this.router.navigate(['/training']);
    //                 } else {
    //                     // this.trainingService.cancelSubscriptions();
    //                     this.isAuthenticated = false;
    //                     this.authChangeNotifier(false);
    //                     // this.router.navigate(['/login']);
    //                 }
    //             },
    //             error => {
    //                 console.log("error: ")
    //                 console.log(error);
    //                 this.uiService.showSnackBar(
    //                     "error when authentication",
    //                     undefined,
    //                     3000
    //                 );
    //             }
    //         )
    //
    // }

    // private getRefreshToken(){
    //     if(this.isToken("refresh")){
    //         console.log(
    //             '%c isRefreshToken yes ',
    //             'background: #fff; color: #000; padding: 10px; border: 1px dashed red;'
    //         );
    //     } else {
    //         console.log(
    //             '%c isRefreshToken no ',
    //             'background: #fff; color: #000; padding: 10px; border: 1px dashed red;'
    //         );
    //     }
    // }

    private getToken(type: string): string{
        return <string>localStorage.getItem(type);
    }

    refreshTokenOrDie(): Observable<boolean> {
        // this.getRefreshToken();
        console.log(
            '%c refreshTokenOrDie 01 ',
            'background: red; color: #fff; padding: 10px;'
        );
        console.log("attache");

        // const payload = {
        //     refresh: "test",
        // };

        if(!this.isToken("refresh")){
            return of(false);
        }

        const payload = {
            refresh: this.getToken('refresh'),
        };

        console.log(payload.refresh);
        return this.http
            .post('/api/user/refresh/', payload)
            .pipe(
                map(
                    (newTokens: any) => {

                        console.log(
                            '%c localStorage.setItem authService ',
                            'background: red; color: #fff; padding: 10px;'
                        );
                        console.log("newTokens :")
                        console.log(newTokens);
                        console.log("newTokens.access :")
                        console.log(newTokens.access)

                        localStorage.setItem('access', newTokens.access);
                        // const decodedUser = this.jwtHelper.decodeToken(
                        //     newTokens.access
                        // );
                        // localStorage.setItem('expiration', decodedUser.exp);

                        // return of(true);
                        return true;
                    }
                ),
                catchError(
                    (error) => {
                        console.log('error');
                        console.log(error);
                        return of(false);
                        // return false;
                    }
                )
            );

    }

    isBothTokensAlive(): Observable<boolean> {
        console.log(
            '%c isBothTokensAlive ',
            'background: green; color: #fff; padding: 10px;'
        );
        if (!this.jwtHelper.isTokenExpired()) {
            return of(true);
        } else {
            return this.refreshTokenOrDie()
        }
    }

    public isToken(type: string): boolean{
        let tokenType: string | any = localStorage.getItem(type);
        console.log(
            '%c tokenType ',
            'background: #fff; color: #000; padding: 10px; border: 1px dashed #000;'
        );
        console.log(tokenType);
        if (tokenType) {
            try {
                let decodedUser = this.jwtHelper.decodeToken(tokenType);
                console.log(
                    "decodedUser.token_type === 'tokenType': ",
                    decodedUser.token_type === 'tokenType'
                );
                console.log('decodedUser: ', decodedUser);
                return true;
            } catch (error) {
                console.error(
                    "The inspected tokenType token doesn't appear to be a JWT."
                );
                return false;
            }
        } else {
            console.log(
                '%c isRefreshToken ',
                'background: #422C78; color: #fff; padding: 10px;'
            );
            console.log(tokenType);
            return false;
        }
    }

    public authState(): Observable<boolean> {
        console.log(
            '%c isAccessToken ',
            'background: green; color: #fff; padding: 0 10px;'
        );
        return this.isToken("access") ? this.isBothTokensAlive() : of(false);
    }

    // public isAuth(): boolean {
    //     return this.isAuthenticated;
    // }

    public authSuccessfully() {
        this.managePeriodicTokenRefresh.initPeriodicRefresh();
        this.authChangeNotifier(true);
        this.router.navigate(['/training'])
    }

}
