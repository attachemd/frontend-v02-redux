import {User} from "./user.model";
import {AuthData} from "./auth-data.model";
import {of, Subject} from "rxjs";
import {Router} from "@angular/router";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {catchError, map} from "rxjs/operators";
import {JwtHelperService} from "@auth0/angular-jwt";

@Injectable()
export class AuthService {
    authChange: Subject<boolean> = new Subject<boolean>();
    private user: User = {
        email: "",
        userId: ""
    };

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
            ).subscribe(
            (result) => {
                if(result){
                    this.authSuccessfully()
                }
            }
        )
    }

    public login(authData: AuthData): void {
        this.user = {
            email: authData.email,
            userId: Math
                .round(Math.random() * 10000)
                .toString()
        }
        this.authSuccessfully()
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

    public isAuth(): boolean {
        return this.user.email !== "" ||
            this.user.userId !== "";
    }

    private authSuccessfully() {
        this.authChange.next(true);
        this.router.navigate(['/training'])
    }

}
