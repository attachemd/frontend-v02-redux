import {Injectable} from "@angular/core";
import {AuthService} from "./auth.service";
import {of, Subject} from "rxjs";
import {catchError, map} from "rxjs/operators";
import {JwtHelperService} from "@auth0/angular-jwt";
import {ExpirationTimeObj} from "./expiration-time.model";

@Injectable()
export class ManagePeriodicTokenRefresh {
    private _timer: number = 0;
    private _refreshChange$: Subject<ExpirationTimeObj> = new Subject<ExpirationTimeObj>();

    constructor(
        private _authService: AuthService,
        private _jwtHelper: JwtHelperService
    ) {
    }

    public setRefreshChange(expirationTimeObj: any): void {
        this._refreshChange$.next(expirationTimeObj);
    }

    public getRefreshChange(): Subject<ExpirationTimeObj> {
        return this._refreshChange$;
    }

    public initPeriodicRefresh() {

        this.getRefreshChange()
            .subscribe(
                expirationTimeObj => {
                    this._doPeriodicRefresh(expirationTimeObj)
                },
                error => {
                    console.log("error: ", error);
                }
            )

        this._startDoPeriodicRefresh()


    }

    private _startDoPeriodicRefresh() {
        this._getTokenExpiredTime()
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
                    this.setRefreshChange(expirationTimeObj);

                },
                error => {
                    console.log("error: ", error);
                }
            )
    }

    private _setIntervalRefreshWithDefaultExpiredTime(expirationTimeObj: ExpirationTimeObj) {
        this._timer = window.setInterval(() => {
            console.log("delayed do refresh " + expirationTimeObj.default_expired_time);
            this._doRefresh();
        }, expirationTimeObj.default_expired_time * 1000);
    }

    private _ifRefreshTokenAlive(expirationTimeObj: ExpirationTimeObj) {
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
        this._timer = window.setTimeout(() => {
            /**
             * Program refresh with default time expired
             */
            console.log("setTimeout " + leftExpiredTime);
            this._doRefresh();
            this._setIntervalRefreshWithDefaultExpiredTime(expirationTimeObj)
        }, leftExpiredTime);
    }

    private _doRefresh() {
        this._authService
            .refreshTokenOrDie()
            .subscribe(
                (isAuth) => {
                    console.log("isAuth: ", isAuth);
                    if (!isAuth) {
                        this._startDoPeriodicRefresh()
                    }
                },
                (error) => {
                    console.log('error: ', error);
                }
            )
    }

    private _doPeriodicRefresh(expirationTimeObj: ExpirationTimeObj) {
        /**
         * if expirationTimeObj.expiration equal to -1
         * then refresh token is expired
         */
        clearInterval(this._timer);
        if (expirationTimeObj.expiration != -1) {
            this._ifRefreshTokenAlive(expirationTimeObj)
        }

    }

    private _getTokenExpiredTime() {
        let expirationTimeObj = {
            default_expired_time: 0,
            // if refresh token expired
            expiration: -1
        }
        return this._authService
            .authState()
            .pipe(
                map(
                    (isAuth) => {

                        if (isAuth) {
                            let access: string | null = localStorage.getItem('access')
                            if (access) {
                                const decodedToken = this._jwtHelper.decodeToken(access);
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
