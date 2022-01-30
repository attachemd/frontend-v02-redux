import { AuthService } from './auth.service';
import { TestBed } from '@angular/core/testing';
import {
    HttpClientTestingModule,
    HttpTestingController,
} from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';
import { UIService } from '../shared/ui.service';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { TestScheduler } from 'rxjs/testing';

let scheduler: TestScheduler;

const validAuthData = {
    email: 'test@test.com',
    password: 'password',
    name: 'test',
};
const invalidAuthData = {
    email: '',
    password: '',
    name: '',
};
const uiServiceSpy = jasmine.createSpyObj('UIService', {
    loadingStateNotifier: undefined,
    showSnackBar: undefined,
});

let actualIsLoadingState: boolean | null;
// let localStore: any;

describe('AuthService', () => {
    let sut: AuthService;
    let jwtHelper: JwtHelperService;
    let controller: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule,
                HttpClientTestingModule,
                JwtModule.forRoot({
                    config: {
                        tokenGetter: () => {
                            return '';
                        },
                    },
                }),
            ],
            providers: [
                {
                    provide: UIService,
                    useValue: uiServiceSpy,
                },
                AuthService,
                JwtHelperService,
            ],
        });
        sut = TestBed.inject(AuthService);
        jwtHelper = TestBed.inject(JwtHelperService);
        controller = TestBed.inject(HttpTestingController);
        scheduler = new TestScheduler((actual, expected) => {
            expect(actual).toEqual(expected);
        });
        actualIsLoadingState = null;

        // localStore = {};
        //
        // spyOn(window.localStorage, 'getItem').and.callFake((key) =>
        //     key in localStore ? localStore[key] : null
        // );
        // spyOn(window.localStorage, 'setItem').and.callFake(
        //     (key, value) => (localStore[key] = value + '')
        // );
        // spyOn(window.localStorage, 'clear').and.callFake(() => (localStore = {}));
    });

    // it(
    //     'authChange$.next should be called when authChangeNotifier',
    //     () => {
    //         spyOn(sut, 'authChangeNotifier');
    //         sut.authChangeNotifier(true);
    //         expect(sut.authChangeNotifier).toHaveBeenCalledWith(true);
    //
    //     }
    // );

    it('Stream authenticated changes ', () => {
        scheduler.run(({ expectObservable, cold }) => {
            // sut.exerciseChangedNotifier(exercise);
            cold('-a').subscribe(() => sut.authChangeNotifier(true));
            expectObservable(sut.getAuthChange()).toBe('-a', { a: true });
        });
    });

    describe('User registration', () => {
        it('User register successfully', () => {
            const response = {
                response: 'Registration Successful!',
                id: 7,
                email: 'test@test.com',
                token: {
                    refresh:
                        'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTYzOTgxOTIxOCwianRpIjoiODQ1ODcyMmI5OWVjNDc4NmJkNjZmMTI1ZjIwZjE5MWMiLCJ1c2VyX2lkIjo3fQ.BloTHDQ6OBRwksiLzJxrWKnnGn-8L6ClzEeJTN4QmH4',
                    access: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjM5NzM0NjE4LCJqdGkiOiI1MzljNzgyYjk3YTc0ZmY0OGIxNGQ0MjZjMmU3Mjg4MSIsInVzZXJfaWQiOjd9.E3WLyrGwvJQhXevTH3o7vCyEQnmBKw1xEbe5oNZ0d4M',
                },
            };

            sut.registerUser(validAuthData).subscribe((isLoadingState) => {
                actualIsLoadingState = isLoadingState;
            });
            console.log('controller: ');
            console.log(controller);
            const request = controller.expectOne({
                method: 'POST',
                url: 'api/user/create/',
            });

            // Answer the request so the Observable emits a value.
            request.flush(response);
            controller.verify();

            // Now verify emitted valued.
            expect(actualIsLoadingState).toEqual(true);
        });

        it('Registration passes through empty response', () => {
            sut.registerUser(validAuthData).subscribe((isLoadingState) => {
                actualIsLoadingState = isLoadingState;
            });

            controller
                .expectOne({
                    method: 'POST',
                    url: 'api/user/create/',
                })
                .flush(null);

            expect(actualIsLoadingState).toEqual(false);
        });

        it('Registration passes through email already exist', () => {
            const response = {
                email: ['user with this email already exists.'],
            };

            sut.registerUser(validAuthData).subscribe((isLoadingState) => {
                actualIsLoadingState = isLoadingState;
            });

            controller
                .expectOne({
                    method: 'POST',
                    url: 'api/user/create/',
                })
                .flush(response);

            expect(actualIsLoadingState).toEqual(false);
        });

        it('Registration passes through error response', () => {
            const status = 500;
            const statusText = 'Internal Server Error';
            const errorEvent = new ErrorEvent('API error');

            // const error = {
            //     "email": [
            //         "user with this email already exists."
            //     ]
            // }

            let actualError: HttpErrorResponse | undefined;

            sut.registerUser(validAuthData).subscribe((isLoadingState) => {
                actualIsLoadingState = isLoadingState;
            });

            // sut.registerUser(validAuthData).subscribe(
            //     () => {
            //         fail('next handler must not be called');
            //     },
            //     (error) => {
            //         actualError = error;
            //     },
            //     () => {
            //         fail('complete handler must not be called');
            //     },
            // );

            controller
                .expectOne({
                    method: 'POST',
                    url: 'api/user/create/',
                })
                .flush(errorEvent, { status, statusText });

            expect(actualIsLoadingState).toEqual(false);
        });
    });

    describe('User login', () => {
        it('User login successfully', () => {
            const response = {
                refresh:
                    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTYzOTgxOTIxOCwianRpIjoiODQ1ODcyMmI5OWVjNDc4NmJkNjZmMTI1ZjIwZjE5MWMiLCJ1c2VyX2lkIjo3fQ.BloTHDQ6OBRwksiLzJxrWKnnGn-8L6ClzEeJTN4QmH4',
                access: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjM5NzM0NjE4LCJqdGkiOiI1MzljNzgyYjk3YTc0ZmY0OGIxNGQ0MjZjMmU3Mjg4MSIsInVzZXJfaWQiOjd9.E3WLyrGwvJQhXevTH3o7vCyEQnmBKw1xEbe5oNZ0d4M',
            };

            sut.login(validAuthData).subscribe((isLoadingState) => {
                actualIsLoadingState = isLoadingState;
            });

            const request = controller.expectOne({
                method: 'POST',
                url: 'api/user/access/',
            });

            // Answer the request so the Observable emits a value.
            request.flush(response);
            controller.verify();

            // Now verify emitted valued.
            expect(actualIsLoadingState).toEqual(true);
        });

        it('Login passes through user form fields empty', () => {
            sut.login(invalidAuthData).subscribe((isLoadingState) => {
                actualIsLoadingState = isLoadingState;
            });

            // controller.expectOne(
            //     {
            //         method: "POST",
            //         url: "api/user/access/"
            //     }
            // )
            //     .flush(null);

            expect(actualIsLoadingState).toEqual(false);
        });

        it('Login passes through error response', () => {
            const status = 500;
            const statusText = 'Internal Server Error';
            const errorEvent = new ErrorEvent('API error');

            // const error = {
            //     "email": [
            //         "user with this email already exists."
            //     ]
            // }

            let actualError: HttpErrorResponse | undefined;

            sut.login(validAuthData).subscribe((isLoadingState) => {
                actualIsLoadingState = isLoadingState;
            });

            // sut.registerUser(validAuthData).subscribe(
            //     () => {
            //         fail('next handler must not be called');
            //     },
            //     (error) => {
            //         actualError = error;
            //     },
            //     () => {
            //         fail('complete handler must not be called');
            //     },
            // );

            controller
                .expectOne({
                    method: 'POST',
                    url: 'api/user/access/',
                })
                .flush(errorEvent, { status, statusText });
            // .flush(error);

            expect(actualIsLoadingState).toEqual(false);

            // if (!actualError) {
            //     throw new Error('Error needs to be defined');
            // }
            // console.log("actualError: ");
            // console.log(actualError);
            // expect(actualError.error).toBe(errorEvent);
            // expect(actualError.status).toBe(status);
            // expect(actualError.statusText).toBe(statusText);
        });

        it('Login passes through empty response', () => {
            sut.login(validAuthData).subscribe((isLoadingState) => {
                actualIsLoadingState = isLoadingState;
            });

            controller
                .expectOne({
                    method: 'POST',
                    url: 'api/user/access/',
                })
                .flush(null);

            expect(actualIsLoadingState).toEqual(false);
        });
    });

    // it('InitAuthListener', async () => {
    //
    //     await sut.initAuthListener()
    //
    //     expect(true).toEqual(true);
    //
    // });

    describe('Refresh ACCESS token', () => {
        it('Refresh access token successfully', () => {
            spyOn<any>(sut, 'getToken').and.returnValue('test');
            spyOn(sut, 'isToken').and.returnValue(true);

            // const payload = {
            //     "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTYzOTgxOTIxOCwianRpIjoiODQ1ODcyMmI5OWVjNDc4NmJkNjZmMTI1ZjIwZjE5MWMiLCJ1c2VyX2lkIjo3fQ.BloTHDQ6OBRwksiLzJxrWKnnGn-8L6ClzEeJTN4QmH4"
            // }

            // const payload = {
            //     "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTYzOTgxOTIxOCwianRpIjoiODQ1ODcyMmI5OWVjNDc4NmJkNjZmMTI1ZjIwZjE5MWMiLCJ1c2VyX2lkIjo3fQ.BloTHDQ6OBRwksiLzJxrWKnnGn-8L6ClzEeJTN4QmH8"
            // }
            const response = {
                access: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjM5NzM0NjE4LCJqdGkiOiI1MzljNzgyYjk3YTc0ZmY0OGIxNGQ0MjZjMmU3Mjg4MSIsInVzZXJfaWQiOjd9.E3WLyrGwvJQhXevTH3o7vCyEQnmBKw1xEbe5oNZ0d8M',
            };
            let actualIsAuth: boolean | undefined;

            sut.refreshTokenOrDie().subscribe((isAuth) => {
                actualIsAuth = isAuth;
            });

            const request = controller.expectOne({
                method: 'POST',
                url: '/api/user/refresh/',
            });

            // Answer the request so the Observable emits a value.
            request.flush(response);
            controller.verify();
            // localStorage.removeItem('refresh');
            let refresh = localStorage.getItem('refresh');

            console.log('refresh: ');
            console.log(
                '%c refresh ',
                'background: yellow; color: #000; padding: 10px;'
            );
            console.log(refresh);
            // Now verify emitted valued.
            expect(actualIsAuth).toEqual(true);
        });

        it('Refresh ACCESS token passes through empty or invalid REFRESH Token', () => {
            spyOn<any>(sut, 'getToken').and.returnValue('test');
            spyOn(sut, 'isToken').and.returnValue(false);

            let actualIsAuth: boolean | undefined;

            sut.refreshTokenOrDie().subscribe((isAuth) => {
                actualIsAuth = isAuth;
            });
            //
            // const request = controller.expectOne(
            //     {
            //         method: "POST",
            //         url: "/api/user/refresh/"
            //     }
            // );
            //
            // Answer the request so the Observable emits a value.
            // request.flush(response);
            // controller.verify();

            // Now verify emitted valued.
            expect(actualIsAuth).toEqual(false);
        });

        it('Refresh ACCESS token passes through error response', () => {
            const status = 500;
            const statusText = 'Internal Server Error';
            const errorEvent = new ErrorEvent('API error');

            spyOn(sut, 'isToken').and.returnValue(true);

            let actualIsAuth: boolean | undefined;

            sut.refreshTokenOrDie().subscribe((isAuth) => {
                actualIsAuth = isAuth;
            });

            controller
                .expectOne({
                    method: 'POST',
                    url: '/api/user/refresh/',
                })
                .flush(errorEvent, { status, statusText });

            expect(actualIsAuth).toEqual(false);
        });
    });

    describe('Check tokens expiration', () => {
        it('Check ACCESS tokens alive', () => {
            spyOn<any>(jwtHelper, 'isTokenExpired').and.returnValue(false);

            let actualIsBothTokensAlive: boolean | undefined;

            sut.isBothTokensAlive().subscribe((isBothTokensAlive) => {
                actualIsBothTokensAlive = isBothTokensAlive;
            });

            // Now verify emitted valued.
            expect(actualIsBothTokensAlive).toEqual(true);
        });

        it('Check REFRESH tokens alive', () => {
            spyOn<any>(jwtHelper, 'isTokenExpired').and.returnValue(true);
            spyOn<any>(sut, 'refreshTokenOrDie').and.returnValue(of(true));

            let actualIsBothTokensAlive: boolean | undefined;

            sut.isBothTokensAlive().subscribe((isBothTokensAlive) => {
                actualIsBothTokensAlive = isBothTokensAlive;
            });

            // Now verify emitted valued.
            expect(actualIsBothTokensAlive).toEqual(true);
        });
    });

    describe('Check ACCESS token validation', () => {
        it('Check ACCESS token validation successfully', () => {
            let access = 'test';

            spyOn(window.localStorage, 'getItem').and.returnValue(access);
            spyOn<any>(jwtHelper, 'decodeToken').and.returnValue('valid');

            let actualIsToken: boolean | undefined;

            actualIsToken = sut.isToken('access');

            // Now verify emitted valued.
            expect(actualIsToken).toEqual(true);
        });
        it('Check ACCESS token validation passes through invalid token', () => {
            let access = 'test';

            spyOn(window.localStorage, 'getItem').and.returnValue(access);
            // spyOn<any>(jwtHelper, 'decodeToken')
            //     .and.returnValue(throwError('someError'));
            spyOn<any>(jwtHelper, 'decodeToken').and.throwError('someError');

            let actualIsToken: boolean | undefined;

            actualIsToken = sut.isToken('access');

            // Now verify emitted valued.
            expect(actualIsToken).toEqual(false);
        });

        it('Check ACCESS token validation passes through empty token', () => {
            let access = '';

            spyOn(window.localStorage, 'getItem').and.returnValue(access);
            spyOn<any>(jwtHelper, 'decodeToken').and.throwError('someError');

            let actualIsToken: boolean | undefined;

            actualIsToken = sut.isToken('access');

            // Now verify emitted valued.
            expect(actualIsToken).toEqual(false);
        });
    });

    describe('Authentication state', () => {
        it('Authentication state passes through alive token', () => {
            spyOn(sut, 'isBothTokensAlive').and.returnValue(of(true));
            spyOn(sut, 'isToken').and.returnValue(true);

            let actualIsAuth: boolean | undefined;

            sut.authState().subscribe((isAuth) => {
                actualIsAuth = isAuth;
            });
            expect(actualIsAuth).toEqual(true);
        });

        it('Authentication state passes through empty ACCESS token', () => {
            spyOn(sut, 'isToken').and.returnValue(false);

            let actualIsAuth: boolean | undefined;

            sut.authState().subscribe((isAuth) => {
                actualIsAuth = isAuth;
            });
            expect(actualIsAuth).toEqual(false);
        });
    });

    describe('Authenticated successfully', function () {
        let router: Router;

        beforeEach(() => {
            router = TestBed.inject(Router);
            spyOn(router, 'navigate');
            // .and.returnValue(false);
            spyOn(sut, 'authChangeNotifier');
            sut.authSuccessfully();
        });
        it('Send Authentication Change', () => {
            expect(sut.authChangeNotifier).toHaveBeenCalled();
        });
        it('Navigate', () => {
            expect(router.navigate).toHaveBeenCalled();
        });
    });

    describe('Logout', () => {
        let router: Router;

        beforeEach(() => {
            router = TestBed.inject(Router);
            spyOn(router, 'navigate');
            // .and.returnValue(false);
            spyOn(sut, 'authChangeNotifier');
            spyOn(window.localStorage, 'removeItem');

            sut.logout();
        });
        it('Remove item from localStorage', () => {
            expect(localStorage.removeItem).toHaveBeenCalled();
        });
        it('Send Authentication Change', () => {
            expect(sut.authChangeNotifier).toHaveBeenCalled();
        });
        it('Navigate to login view', () => {
            expect(router.navigate).toHaveBeenCalledWith(['/login']);
        });
    });
});
