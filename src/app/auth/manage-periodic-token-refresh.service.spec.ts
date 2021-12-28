import {TestBed} from "@angular/core/testing";
import {AuthService} from "./auth.service";
import {JwtHelperService, JwtModule} from "@auth0/angular-jwt";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {of, throwError} from "rxjs";
import {ManagePeriodicTokenRefresh} from "./manage-periodic-token-refresh.service";
import {TestScheduler} from "rxjs/testing";
import {ExpirationTimeObj} from "./expiration-time.model";

fdescribe('ManagePeriodicTokenRefreshService', () => {
    let sut: ManagePeriodicTokenRefresh;
    let authServiceSpy: AuthService;
    let jwtHelper: JwtHelperService;
    let controller: HttpTestingController;
    let scheduler: TestScheduler;

    const status = 500;
    const statusText = 'Internal Server Error';
    const errorEvent = new ErrorEvent('API error');

    const expirationTimeObj: ExpirationTimeObj = {
        default_expired_time: 10,
        expiration: 10
    }

    const setup = (
        authServiceReturnValues?: jasmine.SpyObjMethodNames<AuthService>,
    ) => {
        authServiceSpy = jasmine.createSpyObj<AuthService>(
            'AuthService',
            {
                // Successful responses per default
                authChangeNotifier: undefined,
                registerUser: of(true),
                login: of(true),
                logout: undefined,
                refreshTokenOrDie: of(true),
                isBothTokensAlive: of(true),
                isToken: true,
                authState: of(true),
                authSuccessfully: undefined,
                // Overwrite with given return values
                ...authServiceReturnValues,
            }
        );

        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                JwtModule.forRoot({
                    config: {
                        tokenGetter: () => {
                            return '';
                        }
                    }
                })
            ],
            providers: [
                ManagePeriodicTokenRefresh,
                {provide: AuthService, useValue: authServiceSpy},
                JwtHelperService
            ],
        })

        sut = TestBed.inject(ManagePeriodicTokenRefresh);
        authServiceSpy = TestBed.inject(AuthService);
        jwtHelper = TestBed.inject(JwtHelperService);
        controller = TestBed.inject(HttpTestingController);
        scheduler = new TestScheduler((actual, expected) => {
            expect(actual).toEqual(expected)
        })

    }

    beforeEach(() => {

    });

    it('should be created', () => {
        setup();
        expect(sut).toBeTruthy();
    });

    it('Stream expiration time object when call setRefreshChange with it', () => {
        setup();
        scheduler.run(({expectObservable, cold}) => {
            // sut.exerciseChangedNotifier(exercise);
            cold('-a').subscribe(() => sut.setRefreshChange(expirationTimeObj))
            expectObservable(sut.getRefreshChange()).toBe('-a', {a: expirationTimeObj})
        })
    });

    it('Initialize periodic refresh', () => {
        setup();
        spyOn(sut, 'getRefreshChange').and.callThrough();
        spyOn(<any>sut, '_startDoPeriodicRefresh');
        sut.initPeriodicRefresh();
        // sut.setRefreshChange(expirationTimeObj);
        expect(sut.getRefreshChange).toHaveBeenCalled();
    });

    it('Start do periodic refresh', () => {
        setup();
        spyOn(sut, 'setRefreshChange');
        spyOn(<any>sut, '_getTokenExpiredTime').and.returnValue(of(expirationTimeObj));
        spyOn(<any>sut, '_startDoPeriodicRefresh').and.callThrough();
        (sut as any)._startDoPeriodicRefresh();
        expect((<any>sut)._getTokenExpiredTime).toHaveBeenCalled();
        expect((<any>sut).setRefreshChange).toHaveBeenCalledWith(expirationTimeObj);
    });

    it('Get Token Expired Time if user is authenticated', () => {
        setup();
        let actualExpirationTimeObj: ExpirationTimeObj = {
            default_expired_time: 0,
            expiration: -1
        };
        spyOn(sut, 'setRefreshChange');
        spyOn(<any>sut, '_getTokenExpiredTime').and.callThrough();
        spyOn(localStorage, 'getItem').and.returnValue("test");
        spyOn((sut as any)._jwtHelper, 'decodeToken').and.returnValue({
            default_expired_time: expirationTimeObj.default_expired_time,
            exp: expirationTimeObj.expiration
        });

        (sut as any)._getTokenExpiredTime().subscribe((expirationTimeObj: ExpirationTimeObj) => {
            actualExpirationTimeObj = expirationTimeObj
        })
        expect(actualExpirationTimeObj).toEqual(expirationTimeObj);
    });

    it("Get Token Expired Time if user isn't authenticated", () => {
        setup({
            authState: of(false),
        })
        const expirationTimeObjForNoAccess = {
            default_expired_time: 0,
            expiration: -1
        }
        let actualExpirationTimeObj: ExpirationTimeObj = {
            default_expired_time: 80,
            expiration: 15
        };
        spyOn(sut, 'setRefreshChange');
        // spyOn(authServiceSpy, 'authState').and.returnValue(of(false));

        (sut as any)._getTokenExpiredTime().subscribe((expirationTimeObj: ExpirationTimeObj) => {
            actualExpirationTimeObj = expirationTimeObj
        })
        expect(actualExpirationTimeObj).toEqual(expirationTimeObjForNoAccess);
    });

    it("Get Token Expired Time passes through error", () => {
        let error = new Error('error');
        setup({
            // Let the API report a failure
            authState: throwError(error),
        });
        const expirationTimeObjForNoAccess = {
            default_expired_time: 0,
            expiration: -1
        }
        let actualExpirationTimeObj: ExpirationTimeObj = {
            default_expired_time: 80,
            expiration: 15
        };
        spyOn(window.console, 'log');
        (sut as any)._getTokenExpiredTime().subscribe((expirationTimeObj: ExpirationTimeObj) => {
            actualExpirationTimeObj = expirationTimeObj
        })
        expect(console.log).toHaveBeenCalledWith(
            'from auth.guard.ts error: ',
            error
        );
        expect(actualExpirationTimeObj).toEqual(expirationTimeObjForNoAccess);
    });

    it("Get Token Expired Time passes through error", () => {
        setup();
        let error = new Error('error');
        spyOn(window.console, 'log');
        spyOn(
            (sut as any),
            '_getTokenExpiredTime'
        )
            .and.returnValue(throwError(error));

        (sut as any)._startDoPeriodicRefresh()
        expect(console.log).toHaveBeenCalledWith(
            'error: ',
            error
        );
    });

    it("Successful subscription when call setRefreshChange", () => {
        setup();

        spyOn(
            (sut as any),
            '_doPeriodicRefresh'
        );
        sut.initPeriodicRefresh()
        sut.setRefreshChange(expirationTimeObj)
        expect((sut as any)._doPeriodicRefresh).toHaveBeenCalledWith(
            expirationTimeObj
        );
    });

    it("Get subscription error when subject throw error", () => {
        setup();
        let error = new Error('error');
        spyOn(window.console, 'log');
        spyOn(<any>sut, '_startDoPeriodicRefresh');
        sut.initPeriodicRefresh()
        sut.getRefreshChange().error(error)
        // expect(console.log).toHaveBeenCalled();
        expect(console.log).toHaveBeenCalledWith(
            'error: ',
            error
        );
    });

})
