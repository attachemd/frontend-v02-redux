import {User} from "./user.model";
import {AuthData} from "./auth-data.model";
import {Observable, of, Subject} from "rxjs";
import {Router} from "@angular/router";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {catchError, map} from "rxjs/operators";
import {JwtHelperService} from "@auth0/angular-jwt";
import {flatMap} from "rxjs/operators";

@Injectable()
export class AuthService {
    authChange: Subject<boolean> = new Subject<boolean>();
    private user: User = {
        email: "",
        userId: ""
    };
    private isAuthenticated = false;
    authStateChange: Subject<void> = new Subject<void>();

    constructor(
        private http: HttpClient,
        private router: Router,
        private jwtHelper: JwtHelperService
    ) {
    }


    public registerUser(authData: AuthData): void {
        // this.user = {
        //     email: authData.email,
        //     userId: Math
        //         .round(Math.random() * 10000)
        //         .toString()
        // }
        // this.authSuccessfully()

        this.http
            .post('api/user/create/', authData)
            .pipe(
                map(
                    (data: any) => {

                        if (!data) {
                            return false;
                        }

                        localStorage.setItem(
                            'access',
                            data.token.access
                        );

                        localStorage.setItem(
                            'refresh',
                            data.token.refresh
                        );

                        const decodedUser = this.jwtHelper
                            .decodeToken(data.token.access);

                        localStorage.setItem(
                            'expiration',
                            decodedUser.exp
                        );

                        // this.userInfo.next({
                        //     id: decodedUser.user_id,
                        //     username: login.username,
                        // });
                        return true;
                    }),
                catchError((error) => {
                    console.log('error');
                    console.log(error);
                    return of(false);
                })
            )
            .subscribe(
                (result) => {
                    if (result) {
                        this.authSuccessfully()
                    }
                },
                (error) => {
                    console.log('error :', error)
                }
            )
    }

    public login(authData: AuthData): void {
        // this.user = {
        //     email: authData.email,
        //     userId: Math
        //         .round(Math.random() * 10000)
        //         .toString()
        // }

        if (authData && authData.email && authData.password) {
            this.http
                .post('api/user/access/', authData)
                .pipe(
                    map((data: any) => {
                        if (!data) {
                            return false;
                        }
                        localStorage.setItem('access', data.access);
                        localStorage.setItem('refresh', data.refresh);
                        const decodedUser = this.jwtHelper.decodeToken(data.access);
                        localStorage.setItem('expiration', decodedUser.exp);

                        return true;
                    }),
                    catchError((error) => {
                        console.log('error');
                        console.log(error);
                        return of(false);
                    })
                )
                .subscribe(
                    result => {

                        this.authChange.next(result);
                        this.authSuccessfully()

                    },
                    error => {
                        console.log('error');
                        console.log(error);
                    }
                )
        } else {
            console.log("no login!");
        }
    }

    public logout(): void {
        this.user = {
            email: "",
            userId: ""
        };
        this.authChange.next(false);
        this.router.navigate(['/login'])
    }

    public getUser(): User {
        return {...this.user}
    }

    public initAuthListener(): void {

        this.authStateChange
            .pipe(
                flatMap(()=>{
                    console.log(
                        '%c isAccessToken ',
                        'background: green; color: #fff; padding: 0 10px;'
                    );
                    return this.isAccessToken() ? this.isBothTokensAlive() : of(false);
                })
            )
            .subscribe(isAuth => {
            if (isAuth) {
                this.isAuthenticated = true;
                this.authChange.next(true);
                // this.router.navigate(['/training']);
            } else {
                // this.trainingService.cancelSubscriptions();
                this.isAuthenticated = false;
                this.authChange.next(false);
                // this.router.navigate(['/login']);
            }
        })
    }

    refreshTokenOrDie(): Observable<boolean> {
        const payload = {
            refresh: localStorage.getItem('refresh'),
        };

        return this.http
            .post('/api/user/refresh/', payload)
            .pipe(
                map((newTokens: any) => {
                    localStorage.setItem('access', newTokens.access);
                    const decodedUser = this.jwtHelper.decodeToken(
                        newTokens.access
                    );
                    localStorage.setItem('expiration', decodedUser.exp);
                    return true;
                }),

                catchError((error: any) => {
                    console.error(error);
                    return of(false);
                })
            );

    }

    isAccessToken(): boolean {
        let access: string | any = localStorage.getItem('access');
        if (access) {
            try {
                let decodedUser = this.jwtHelper.decodeToken(access);
                console.log(
                    "decodedUser.token_type === 'access': ",
                    decodedUser.token_type === 'access'
                );
                console.log('decodedUser: ', decodedUser);
                return true;
            } catch (error) {
                console.error(
                    "The inspected token doesn't appear to be a JWT."
                );
                return false;
            }
        } else {
            return false;
        }
    }

    isBothTokensAlive(): Observable<boolean> {
        if (!this.jwtHelper.isTokenExpired()) {
            return of(true);
        } else {
            return this.refreshTokenOrDie()
        }
    }

    public authState(): Observable<boolean> {
        console.log(
            '%c isAccessToken ',
            'background: green; color: #fff; padding: 0 10px;'
        );
        return this.isAccessToken() ? this.isBothTokensAlive() : of(false);
    }


    public isAuth(): boolean {
        return this.isAuthenticated;
    }

    private authSuccessfully() {
        this.authChange.next(true);
        this.router.navigate(['/training'])
    }

}
