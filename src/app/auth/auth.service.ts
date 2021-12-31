import {User} from "./user.model";
import {AuthData} from "./auth-data.model";
import {Observable, of, Subject} from "rxjs";
import {Router} from "@angular/router";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {catchError, map} from "rxjs/operators";
import {JwtHelperService} from "@auth0/angular-jwt";
import {UIService} from "../shared/ui.service";

interface Data {
    response: string,
    id: number,
    email: string,
    token?: object
}

@Injectable()
export class AuthService {

    private authChange$: Subject<boolean> = new Subject<boolean>();
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
        private uiService: UIService
    ) {
    }

    public authChangeNotifier(isAuthenticated: boolean) {
        this.authChange$.next(isAuthenticated);
    }

    public getAuthChange(): Subject<boolean> {
        return this.authChange$
    }

    public registerUser(authData: AuthData): Observable<boolean>  {

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
        if (!(authData && authData.email && authData.password)) {
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
                    localStorage.setItem('access', data.access);
                    localStorage.setItem('refresh', data.refresh);
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

    private getToken(type: string): string{
        return <string>localStorage.getItem(type);
    }

    refreshTokenOrDie(): Observable<boolean> {

        if(!this.isToken("refresh")){
            return of(false);
        }

        const payload = {
            refresh: this.getToken('refresh'),
        };

        return this.http
            .post('/api/user/refresh/', payload)
            .pipe(
                map(
                    (newTokens: any) => {
                        localStorage.setItem('access', newTokens.access);
                        return true;
                    }
                ),
                catchError(
                    (error) => {
                        console.log('error');
                        console.log(error);
                        return of(false);
                    }
                )
            );

    }

    isBothTokensAlive(): Observable<boolean> {
        if (!this.jwtHelper.isTokenExpired()) {
            return of(true);
        } else {
            return this.refreshTokenOrDie()
        }
    }

    public isToken(type: string): boolean{
        let tokenType: string | any = localStorage.getItem(type);
        if (tokenType) {
            try {
                this.jwtHelper.decodeToken(tokenType);
                return true;
            } catch (error) {
                return false;
            }
        } else {
            return false;
        }
    }

    public authState(): Observable<boolean> {
        return this.isToken("access") ? this.isBothTokensAlive() : of(false);
    }

    public authSuccessfully() {
        this.authChangeNotifier(true);
        this.router.navigate(['/training'])
    }

}
