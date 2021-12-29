import {discardPeriodicTasks, fakeAsync, flush, flushMicrotasks, TestBed, tick} from "@angular/core/testing";
import {AuthService} from "./auth.service";
import {JwtHelperService, JwtModule} from "@auth0/angular-jwt";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {Observable, of, Subject, throwError} from "rxjs";
import {ManagePeriodicTokenRefresh} from "./manage-periodic-token-refresh.service";
import {TestScheduler} from "rxjs/testing";
import {ExpirationTimeObj} from "./expiration-time.model";

let sut: ManagePeriodicTokenRefresh;
// let authServiceSpy: AuthService;
// let authServiceSpy: Pick<AuthService, keyof AuthService>;
let authServiceSpy: Partial<AuthService>;
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

const expirationTimeObjNotSet: ExpirationTimeObj = {
    default_expired_time: 0,
    expiration: -1
}

let testBedConfig = () => {
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

    // spyOn(authServiceSpy, 'authState').and.returnValues(of(true), of(false))

    testBedConfig()

}


describe('ManagePeriodicTokenRefreshService White Box testing', () => {


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

        let actualExpirationTimeObj: ExpirationTimeObj = {
            default_expired_time: 80,
            expiration: 15
        };
        spyOn(sut, 'setRefreshChange');
        // spyOn(authServiceSpy, 'authState').and.returnValue(of(false));

        (sut as any)._getTokenExpiredTime().subscribe((expirationTimeObj: ExpirationTimeObj) => {
            actualExpirationTimeObj = expirationTimeObj
        })
        expect(actualExpirationTimeObj).toEqual(expirationTimeObjNotSet);
    });

    it("Get Token Expired Time passes through error", () => {
        let error = new Error('error');
        setup({
            // Let the API report a failure
            authState: throwError(error),
        });
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
        expect(actualExpirationTimeObj).toEqual(expirationTimeObjNotSet);
    });

    it("Start do periodic refresh passes through error", () => {
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

    it("Do periodic refresh", () => {
        setup();
        (sut as any)._timer = 11;
        spyOn(window, 'clearInterval');
        spyOn((sut as any), '_ifRefreshTokenAliveDoRefresh');
        (sut as any)._doPeriodicRefresh(expirationTimeObj)
        expect((sut as any)._ifRefreshTokenAliveDoRefresh).toHaveBeenCalledWith(expirationTimeObj);
        expect(clearInterval).toHaveBeenCalledWith((sut as any)._timer);
    });

    it("Skip periodic refresh if expiration not set", () => {
        setup();
        (sut as any)._timer = 11;
        spyOn(window, 'clearInterval');
        spyOn((sut as any), '_ifRefreshTokenAliveDoRefresh');
        (sut as any)._doPeriodicRefresh(expirationTimeObjNotSet)
        expect((sut as any)._ifRefreshTokenAliveDoRefresh).not.toHaveBeenCalled();
        expect(clearInterval).toHaveBeenCalledWith((sut as any)._timer);
    });

    it("If Refresh Token Alive Do Refresh now", fakeAsync(
        () => {
            setup();

            spyOn((sut as any), '_doRefresh');
            spyOn((sut as any), '_setIntervalRefreshWithDefaultExpiredTime');
            (sut as any)._ifRefreshTokenAliveDoRefresh(expirationTimeObj)
            // tick(3000);

            tick(4000);
            // jasmine.clock().tick(0)
            // expect(setTimeout).toHaveBeenCalled();
            expect((sut as any)._doRefresh).toHaveBeenCalled();
            expect((sut as any)._setIntervalRefreshWithDefaultExpiredTime).toHaveBeenCalledWith(expirationTimeObj);
            // flush();
        }
    ));

    it("If Refresh Token Alive Do Refresh later  ", fakeAsync(
        () => {
            setup();
            // const expirationTimeObjCopy = Object.assign({}, expirationTimeObj);
            const expirationTimeObjCopy = {...expirationTimeObj};
            expirationTimeObjCopy.expiration = (Date.now() + 3000) / 1000;
            // expirationTimeObj.expiration = (Date.now() + 3000) / 1000;
            // spyOn(window, 'setTimeout').and.callThrough();
            spyOn((sut as any), '_doRefresh');
            spyOn((sut as any), '_setIntervalRefreshWithDefaultExpiredTime');
            (sut as any)._ifRefreshTokenAliveDoRefresh(expirationTimeObjCopy)
            tick(3000)
            // expect(setTimeout).toHaveBeenCalled();
            expect((sut as any)._doRefresh).toHaveBeenCalled();
            expect((sut as any)._setIntervalRefreshWithDefaultExpiredTime).toHaveBeenCalledWith(expirationTimeObjCopy);
            flush()
        }
    ));

    it("Don't refresh if already authenticated",
        () => {
            setup();


            spyOn((sut as any), '_startDoPeriodicRefresh');
            (sut as any)._doRefresh()

            expect((sut as any)._startDoPeriodicRefresh).not.toHaveBeenCalled();
        }
    );

    it("Do refresh if not authenticated",
        () => {
            setup({
                refreshTokenOrDie: of(false),
            });

            spyOn((sut as any), '_startDoPeriodicRefresh');
            (sut as any)._doRefresh()

            expect((sut as any)._startDoPeriodicRefresh).toHaveBeenCalled();
        }
    );

    it("Do refresh passes through error",
        () => {
            let error = new Error('error');

            spyOn(window.console, 'log');


            setup({
                refreshTokenOrDie: throwError(error),
            });

            spyOn((sut as any), '_startDoPeriodicRefresh');
            (sut as any)._doRefresh()

            expect((sut as any)._startDoPeriodicRefresh).not.toHaveBeenCalled();
            expect(console.log).toHaveBeenCalledWith(
                'error: ',
                error
            );
        }
    );

    it("Set interval refresh with default expired time ",
        fakeAsync(() => {
                setup();
                spyOn(window, 'setInterval').and.callThrough();
                spyOn((sut as any), '_doRefresh');
                (sut as any)._setIntervalRefreshWithDefaultExpiredTime(expirationTimeObj);
                tick(20000);
                // flushMicrotasks();

                expect((sut as any)._doRefresh).toHaveBeenCalled();
                expect(setInterval).toHaveBeenCalled();
                discardPeriodicTasks();
            }
        )
    );


})

fdescribe('ManagePeriodicTokenRefreshService Black Box testing', () => {


    // let authServiceSpy: Partial<AuthService>;

    // const setup = () => {
    // //     authServiceSpy = {
    // //         // authChange$: new Subject<boolean>(),
    // //         authChangeNotifier(): void {
    // //         },
    // //         registerUser(): Observable<boolean> {
    // //             return of(true);
    // //         },
    // //         login(): Observable<boolean> {
    // //             return of(true);
    // //         },
    // //         logout(): void {
    // //         },
    // //         refreshTokenOrDie(): Observable<boolean> {
    // //             return of(true);
    // //         },
    // //         isBothTokensAlive(): Observable<boolean> {
    // //             return of(true);
    // //         },
    // //         isToken(): boolean {
    // //             return true;
    // //         },
    // //         authState(): Observable<boolean> {
    // //             return of(true);
    // //         },
    // //         authSuccessfully(): Observable<boolean> {
    // //             return of(true);
    // //         },
    // //     };
    //
    //     // authServiceSpy = jasmine.createSpyObj<AuthService>(
    //     //     'AuthService',
    //     //     {
    //     //         // Successful responses per default
    //     //         authChangeNotifier: undefined,
    //     //         registerUser: of(true),
    //     //         login: of(true),
    //     //         logout: undefined,
    //     //         refreshTokenOrDie: of(true),
    //     //         isBothTokensAlive: of(true),
    //     //         isToken: true,
    //     //         authState: of(true),
    //     //         authSuccessfully: undefined,
    //     //         // Overwrite with given return values
    //     //     }
    //     // );
    //     testBedConfig()
    // }

     beforeAll(() => {
         setup();
     })

    beforeEach(() => {

    });

    it('should be created', () => {
        // setup();
        expect(sut).toBeTruthy();
    });

    it('Stream expiration time object when call setRefreshChange with it', () => {
        // setup();
        scheduler.run(({expectObservable, cold}) => {
            // sut.exerciseChangedNotifier(exercise);
            cold('-a').subscribe(() => sut.setRefreshChange(expirationTimeObj))
            expectObservable(sut.getRefreshChange()).toBe('-a', {a: expirationTimeObj})
        })
    });

    describe('Initialize periodic refresh', () => {
        beforeAll(() => {
            setup();
        })
        spyOn(sut, 'getRefreshChange').and.callThrough();
        spyOn(<any>sut, '_startDoPeriodicRefresh').and.callThrough();
        sut.initPeriodicRefresh();
        sut.setRefreshChange(expirationTimeObj);

        it('Normal', () => {
            // const authServiceSpy: Pick<AuthService, 'authState'> = {
            //     authState() {
            //         return of(true);
            //     },
            // };
            // authServiceSpy = {
            //     authState() {
            //         return of(true);
            //     },
            // };
            // authServiceSpy = jasmine.createSpyObj<AuthService>(
            //     'AuthService',
            //     {
            //         authState: of(true),
            //     }
            // );

            // setup();
            // spyOn(authServiceSpy, 'authState').and.callThrough();

            // spyOn(sut, 'getRefreshChange').and.callThrough();
            // spyOn(<any>sut, '_startDoPeriodicRefresh').and.callThrough();
            // sut.initPeriodicRefresh();
            // sut.setRefreshChange(expirationTimeObj);

            expect(sut.getRefreshChange).toHaveBeenCalled();
        });
    })




})
