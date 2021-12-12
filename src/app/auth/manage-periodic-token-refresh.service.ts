import {Injectable} from "@angular/core";
import {AuthService} from "./auth.service";
import {of, Subject} from "rxjs";
import {catchError, map} from "rxjs/operators";
import {JwtHelperService} from "@auth0/angular-jwt";

interface ExpirationTimeObj {
    default_expired_time: number;
    expiration: number;
}

@Injectable()
export class ManagePeriodicTokenRefresh {
    timer: number = 0;
    refreshChange: Subject<ExpirationTimeObj> = new Subject<ExpirationTimeObj>();

    constructor(
        private authService: AuthService,
        private jwtHelper: JwtHelperService
    ) {
    }

    public initPeriodicRefresh() {

        this.refreshChange
            .subscribe(
                expirationTimeObj => {
                    this.doPeriodicRefresh(expirationTimeObj)
                },
                error => {
                    console.log("error: ", error);
                }
            )

        this.startDoPeriodicRefresh()


    }

    private startDoPeriodicRefresh() {
        this.getTokenExpiredTime()
            .subscribe(
                expirationTimeObj => {
                    console.log(
                        '%c expiration: ',
                        'background: white; ' +
                        'color: red; ' +
                        'padding: 10px; ' +
                        'border: 1px solid #000'
                    );
                    console.log(expirationTimeObj)
                    this.refreshChange.next(expirationTimeObj);

                },
                error => {
                    console.log("error: ", error);
                }
            )
    }

    setIntervalRefreshWithDefaultExpiredTime(expirationTimeObj: ExpirationTimeObj) {
        this.timer = window.setInterval(() => {
            console.log("delayed do refresh " + expirationTimeObj.default_expired_time);
            this.doRefresh();
        }, expirationTimeObj.default_expired_time * 1000);
    }

    ifRefreshTokenAlive(expirationTimeObj: ExpirationTimeObj) {
        let leftExpiredTime = (Number(expirationTimeObj.expiration) * 1000) - Date.now()
        console.log(
            '%c leftExpiredTime: ',
            'background: yellow; ' +
            'color: black; ' +
            'padding: 10px; ' +
            'border: 1px solid #000'
        );
        console.log(leftExpiredTime)

        if (leftExpiredTime < 0) {
            /**
             * Do refresh now
             */

            leftExpiredTime = 0;
            console.log(
                "do refresh now with default expired time " +
                expirationTimeObj.default_expired_time
            );
        }
        this.timer = window.setTimeout(() => {
            /**
             * Program refresh with default time expired
             */
            console.log("setTimeout " + leftExpiredTime);
            this.doRefresh();
            this.setIntervalRefreshWithDefaultExpiredTime(expirationTimeObj)
        }, leftExpiredTime);
    }

    doRefresh() {
        this.authService
            .refreshTokenOrDie()
            .subscribe(
                (isAuth) => {
                    console.log("isAuth: ", isAuth);
                    if (!isAuth) {
                        this.startDoPeriodicRefresh()
                    }
                },
                (error) => {
                    console.log('error: ', error);
                }
            )
    }

    doPeriodicRefresh(expirationTimeObj: ExpirationTimeObj) {
        /**
         * if expirationTimeObj.expiration equal to -1
         * then refresh token is expired
         */
        clearInterval(this.timer);
        if (expirationTimeObj.expiration != -1) {
            this.ifRefreshTokenAlive(expirationTimeObj)
        }

    }

    getTokenExpiredTime() {
        let expirationTimeObj = {
            default_expired_time: 0,
            // if refresh token expired
            expiration: -1
        }
        return this.authService
            .authState()
            .pipe(
                map(
                    (isAuth) => {

                        if (isAuth) {
                            let access: string | null = localStorage.getItem('access')
                            if (access) {
                                const decodedToken = this.jwtHelper.decodeToken(access);
                                console.log(
                                    '%c decodeToken: ',
                                    'background: red; ' +
                                    'color: white; ' +
                                    'padding: 10px; ' +
                                    'border: 1px solid #000'
                                );
                                console.log(decodedToken)
                                expirationTimeObj.default_expired_time =
                                    decodedToken.default_expired_time;
                                expirationTimeObj.expiration =
                                    decodedToken.exp;
                            }

                        }
                        return expirationTimeObj
                    }
                ),
                catchError(
                    (error) => {
                        console.log('from auth.guard.ts error: ', error);
                        return of(expirationTimeObj);
                    }
                )
            )
    }

}
