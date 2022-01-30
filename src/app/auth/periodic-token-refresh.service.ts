import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { of, Subject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ExpirationTimeObj } from './expiration-time.model';

@Injectable()
export class ManagePeriodicTokenRefresh {
    private _timer: number = 0;
    private _refreshChange$: Subject<ExpirationTimeObj> =
        new Subject<ExpirationTimeObj>();

    constructor(
        private _authService: AuthService,
        private _jwtHelper: JwtHelperService
    ) {}

    public setRefreshChange(expirationTimeObj: any): void {
        this._refreshChange$.next(expirationTimeObj);
    }

    public getRefreshChange(): Subject<ExpirationTimeObj> {
        return this._refreshChange$;
    }

    /**
     * If the user has been authenticated, start the token refresh process.
     */

    public initPeriodicRefresh() {
        this.getRefreshChange().subscribe(
            (expirationTimeObj) => {
                this._doPeriodicRefresh(expirationTimeObj);
            },
            (error) => {
                console.log('error: ', error);
            }
        );

        this._getAndNotifyExpiredTime();
    }

    private _getAndNotifyExpiredTime() {
        this._getTokenExpiredTime().subscribe(
            (expirationTimeObj) => {
                this.setRefreshChange(expirationTimeObj);
            },
            (error) => {
                console.log('error: ', error);
            }
        );
    }

    private _doPeriodicRefresh(expirationTimeObj: ExpirationTimeObj) {
        /**
         * if expirationTimeObj.expiration equal to -1
         * then refresh token is expired
         */
        clearInterval(this._timer);
        if (expirationTimeObj.expiration != -1)
            this._ifRefreshTokenAliveDoRefresh(expirationTimeObj);
    }

    private _ifRefreshTokenAliveDoRefresh(
        expirationTimeObj: ExpirationTimeObj
    ) {
        let leftExpiredTime =
            Number(expirationTimeObj.expiration) * 1000 - Date.now();

        if (leftExpiredTime < 0)
            /**
             * Do refresh now
             */

            leftExpiredTime = 0;
        else {
        }
        // if (leftExpiredTime < 0) leftExpiredTime = 0;
        this._timer = window.setTimeout(() => {
            /**
             * Program refresh with default time expired
             */
            this._doRefresh();
            this._setIntervalRefreshWithDefaultExpiredTime(expirationTimeObj);
        }, leftExpiredTime);
    }

    private _doRefresh() {
        this._authService.refreshTokenOrDie().subscribe(
            (isAuth) => {
                if (!isAuth) this._getAndNotifyExpiredTime();
            },
            (error) => {
                console.log('error: ', error);
            }
        );
    }

    private _setIntervalRefreshWithDefaultExpiredTime(
        expirationTimeObj: ExpirationTimeObj
    ) {
        this._timer = window.setInterval(() => {
            this._doRefresh();
        }, expirationTimeObj.default_expired_time * 1000);
    }

    private _getTokenExpiredTime() {
        let expirationTimeObj = {
            default_expired_time: 0,
            // if refresh token expired
            expiration: -1,
        };

        return this._authService.authState().pipe(
            map((isAuth) => {
                if (isAuth) {
                    let access: string | null = localStorage.getItem('access');

                    if (access) {
                        const decodedToken =
                            this._jwtHelper.decodeToken(access);

                        expirationTimeObj.default_expired_time =
                            decodedToken.default_expired_time;
                        expirationTimeObj.expiration = decodedToken.exp;
                    }
                }
                return expirationTimeObj;
            }),
            catchError((error) => {
                console.log('from auth.guard.ts error: ', error);
                return of(expirationTimeObj);
            })
        );
    }
}
