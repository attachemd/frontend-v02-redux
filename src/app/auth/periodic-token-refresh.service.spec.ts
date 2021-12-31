import {discardPeriodicTasks, fakeAsync, flush, TestBed, tick} from "@angular/core/testing";
import {AuthService} from "./auth.service";
import {JwtHelperService, JwtModule} from "@auth0/angular-jwt";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {of, throwError} from "rxjs";
import {TestScheduler} from "rxjs/testing";
import {ExpirationTimeObj} from "./expiration-time.model";
import {ManagePeriodicTokenRefresh} from "./periodic-token-refresh.service";

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

    it('Stream expiration time object', () => {
        setup();
        scheduler.run(({expectObservable, cold}) => {
            // sut.exerciseChangedNotifier(exercise);
            cold('-a').subscribe(() => sut.setRefreshChange(expirationTimeObj))
            expectObservable(sut.getRefreshChange()).toBe('-a', {a: expirationTimeObj})
        })
    });
    describe('Initialize periodic refresh',
        () => {
            beforeAll(() => {
                setup();
                spyOn(sut, 'getRefreshChange').and.callThrough();
                spyOn(<any>sut, '_getAndNotifyExpiredTime');
                sut.initPeriodicRefresh();
                // sut.setRefreshChange(expirationTimeObj);
            })
            it('Subscribe to the subject refresh changes', () => {
                expect(sut.getRefreshChange).toHaveBeenCalled();
            });
            it('Get and notify expired time', () => {
                expect((sut as any)._getAndNotifyExpiredTime).toHaveBeenCalled();
            });
        }
    )

    describe('Get and notify expired time',
        () => {
            beforeAll(() => {
                setup();
                spyOn(sut, 'setRefreshChange');
                spyOn(<any>sut, '_getTokenExpiredTime').and.returnValue(of(expirationTimeObj));
                // spyOn(<any>sut, '_getAndNotifyExpiredTime').and.callThrough();
                (sut as any)._getAndNotifyExpiredTime();
            })

            it('subscribe to the subject refresh changes', () => {
                expect((<any>sut)._getTokenExpiredTime).toHaveBeenCalled();
            });

            it('notify refresh change', () => {
                expect((<any>sut).setRefreshChange).toHaveBeenCalledWith(expirationTimeObj);
            });

        }
    )

    describe('Get Token Expired Time',
        () => {
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
        }
    )


    it("Get and notify expired time passes through error", () => {
        setup();
        let error = new Error('error');
        spyOn(window.console, 'log');
        spyOn(
            (sut as any),
            '_getTokenExpiredTime'
        )
            .and.returnValue(throwError(error));

        (sut as any)._getAndNotifyExpiredTime()
        expect(console.log).toHaveBeenCalledWith(
            'error: ',
            error
        );
    });
    describe('Refresh change get notified', () => {
        it("Successful subscription when call setRefreshChange", () => {
            setup();

            spyOn(
                (sut as any),
                '_doPeriodicRefresh'
            );
            spyOn(
                (sut as any),
                '_getAndNotifyExpiredTime'
            );
            sut.initPeriodicRefresh()
            sut.setRefreshChange(expirationTimeObj)
            expect((sut as any)._doPeriodicRefresh).toHaveBeenCalledWith(
                expirationTimeObj
            );
            expect((sut as any)._getAndNotifyExpiredTime).toHaveBeenCalled();
        });

        it("Get subscription error when subject throw error", () => {
            setup();
            let error = new Error('error');
            spyOn(window.console, 'log');
            spyOn(<any>sut, '_getAndNotifyExpiredTime');
            sut.initPeriodicRefresh()
            sut.getRefreshChange().error(error)
            // expect(console.log).toHaveBeenCalled();
            expect(console.log).toHaveBeenCalledWith(
                'error: ',
                error
            );
        });
    })

    describe('Do periodic refresh', () => {
        beforeEach(() => {
            setup();
            (sut as any)._timer = 11;
            spyOn(window, 'clearInterval');
            spyOn((sut as any), '_ifRefreshTokenAliveDoRefresh');
        })
        it(
            "Stop & do periodic refresh if user is authenticated",
            () => {
                (sut as any)._doPeriodicRefresh(expirationTimeObj)
                expect((sut as any)._ifRefreshTokenAliveDoRefresh).toHaveBeenCalledWith(expirationTimeObj);
                expect(clearInterval).toHaveBeenCalledWith((sut as any)._timer);
            }
        );

        it(
            "Stop & skip periodic refresh if user is not authenticated",
            () => {
                (sut as any)._doPeriodicRefresh(expirationTimeObjNotSet)
                expect((sut as any)._ifRefreshTokenAliveDoRefresh).not.toHaveBeenCalled();
                expect(clearInterval).toHaveBeenCalledWith((sut as any)._timer);
            }
        );
    })

    describe('If Refresh Token Alive Do Refresh', () => {
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

        it("If Refresh Token Alive Do Refresh later", fakeAsync(
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
    })

    describe('Do refresh', () => {
        it("Don't refresh if already authenticated",
            () => {
                setup();


                spyOn((sut as any), '_getAndNotifyExpiredTime');
                (sut as any)._doRefresh()

                expect((sut as any)._getAndNotifyExpiredTime).not.toHaveBeenCalled();
            }
        );

        it("Do refresh if not authenticated",
            () => {
                setup({
                    refreshTokenOrDie: of(false),
                });

                spyOn((sut as any), '_getAndNotifyExpiredTime');
                (sut as any)._doRefresh()

                expect((sut as any)._getAndNotifyExpiredTime).toHaveBeenCalled();
            }
        );

        it("Do refresh passes through error",
            () => {
                let error = new Error('error');

                spyOn(window.console, 'log');


                setup({
                    refreshTokenOrDie: throwError(error),
                });

                spyOn((sut as any), '_getAndNotifyExpiredTime');
                (sut as any)._doRefresh()

                expect((sut as any)._getAndNotifyExpiredTime).not.toHaveBeenCalled();
                expect(console.log).toHaveBeenCalledWith(
                    'error: ',
                    error
                );
            }
        );
    })

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

// describe(
//     'ManagePeriodicTokenRefreshService Black Box testing',
//     () => {
//
//         beforeAll(() => {
//             setup();
//         })
//
//         beforeEach(() => {
//             // setup();
//         });
//
//         it('should be created', () => {
//             // setup();
//             expect(sut).toBeTruthy();
//         });
//
//         it('Stream expiration time object when call setRefreshChange with it', () => {
//             // setup();
//             scheduler.run(({expectObservable, cold}) => {
//                 // sut.exerciseChangedNotifier(exercise);
//                 cold('-a').subscribe(() => sut.setRefreshChange(expirationTimeObj))
//                 expectObservable(sut.getRefreshChange()).toBe('-a', {a: expirationTimeObj})
//             })
//         });
//
//         describe('Initialize periodic refresh with token expired', () => {
//             beforeAll(fakeAsync(() => {
//                 // setup();
//
//                 spyOn(sut, 'getRefreshChange').and.callThrough();
//                 spyOn(<any>sut, '_getAndNotifyExpiredTime').and.callThrough();
//                 spyOn(<any>sut, '_getTokenExpiredTime').and.callThrough();
//                 spyOn(sut, 'setRefreshChange').and.callThrough();
//                 spyOn(<any>sut, '_doPeriodicRefresh').and.callThrough();
//                 spyOn(window, 'clearInterval').and.callThrough();
//                 spyOn(<any>sut, '_ifRefreshTokenAliveDoRefresh').and.callThrough();
//                 spyOn(window, 'setTimeout').and.callThrough();
//                 spyOn(<any>sut, '_doRefresh').and.callThrough();
//                 spyOn(<any>sut, '_setIntervalRefreshWithDefaultExpiredTime')
//                     .and
//                     .callThrough();
//                 spyOn(window, 'setInterval').and.callThrough();
//                 sut.initPeriodicRefresh();
//                 sut.setRefreshChange(expirationTimeObj);
//                 tick(20000)
//                 discardPeriodicTasks();
//             }))
//
//             // afterAll(fakeAsync(() => {
//             //     discardPeriodicTasks();
//             // }))
//
//
//             describe('Instructions start',
//                 () => {
//                     it('Subscribe to the subject refresh changes', () => {
//                         expect(sut.getRefreshChange).toHaveBeenCalled();
//                     });
//                     it('Get and notify expired time', () => {
//                         expect((sut as any)._getAndNotifyExpiredTime)
//                             .toHaveBeenCalled();
//                     });
//                 }
//             )
//
//             describe('Get and notify expired time',
//                 () => {
//                     it('subscribe to the subject refresh changes',
//                         () => {
//                             expect((sut as any)._getTokenExpiredTime).toHaveBeenCalled();
//                         }
//                     );
//                     it('notify refresh change', () => {
//                         expect(sut.setRefreshChange)
//                             .toHaveBeenCalledWith(expirationTimeObj);
//                     });
//                 }
//             )
//
//
//             it('Refresh change subject get notified',
//                 () => {
//                     expect((sut as any)._doPeriodicRefresh)
//                         .toHaveBeenCalledWith(expirationTimeObj);
//                 }
//             );
//
//             describe('Do periodic refresh',
//                 () => {
//                     it('Clear timer', () => {
//                         expect(clearInterval).toHaveBeenCalled();
//                     });
//
//                     it('If refresh token alive do refresh', () => {
//                         expect((sut as any)._ifRefreshTokenAliveDoRefresh)
//                             .toHaveBeenCalledWith(expirationTimeObj);
//                     });
//                 }
//             )
//
//             describe('If refresh token expired do refresh now',
//                 () => {
//                     it('Clear timer called immediately', () => {
//                         expect(clearInterval).toHaveBeenCalled();
//                     });
//
//                     it('Do refresh', () => {
//                         expect((sut as any)._doRefresh).toHaveBeenCalled();
//                     });
//
//                     it('Set interval refresh with default expired time', () => {
//                         expect((sut as any)._setIntervalRefreshWithDefaultExpiredTime)
//                             .toHaveBeenCalledWith(expirationTimeObj);
//                     });
//                 }
//             )
//
//             describe('Do refresh',
//                 () => {
//                     it(`Subscribe to the observable refreshTokenOrDie
//                     but user not authenticated then no Get and notify expired time`,
//                         () => {
//                             expect(authServiceSpy.refreshTokenOrDie).toHaveBeenCalled();
//                         }
//                     );
//
//                 }
//             )
//
//             describe('Set interval refresh with default expired time',
//                 () => {
//                     it(`Subscribe to the observable refreshTokenOrDie
//                     but user not authenticated then no Get and notify expired time`,
//                         () => {
//
//                             expect(setInterval).toHaveBeenCalled();
//
//                         }
//                     );
//
//                 }
//             )
//
//
//         })
//
//
//     }
// )
