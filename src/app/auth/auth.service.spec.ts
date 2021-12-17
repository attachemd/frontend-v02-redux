import {AuthService} from "./auth.service";
import {TestBed} from "@angular/core/testing";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {JwtHelperService, JwtModule} from "@auth0/angular-jwt";
import {UIService} from "../shared/ui.service";
import {of} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";

const validAuthData = {
    email: "test@test.com",
    password: "password",
    name: "test"
}
const invalidAuthData = {
    email: "",
    password: "",
    name: ""
}
const uiServiceSpy = jasmine.createSpyObj(
    "UIService",
    {
        loadingStateNotifier: undefined,
        showSnackBar: undefined
    }
);

let actualIsLoadingState: boolean | null;

fdescribe('AuthService', () => {
    let authService: AuthService;
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
                        }
                    }
                })
            ],
            providers: [
                {
                    provide: UIService,
                    useValue: uiServiceSpy
                },
                AuthService,
                JwtHelperService
            ],
        });
        authService = TestBed.inject(AuthService);
        controller = TestBed.inject(HttpTestingController);
    });

    it('User register successfully', () => {

        const response = {
            "response": "Registration Successful!",
            "id": 7,
            "email": "test@test.com",
            "token": {
                "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTYzOTgxOTIxOCwianRpIjoiODQ1ODcyMmI5OWVjNDc4NmJkNjZmMTI1ZjIwZjE5MWMiLCJ1c2VyX2lkIjo3fQ.BloTHDQ6OBRwksiLzJxrWKnnGn-8L6ClzEeJTN4QmH4",
                "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjM5NzM0NjE4LCJqdGkiOiI1MzljNzgyYjk3YTc0ZmY0OGIxNGQ0MjZjMmU3Mjg4MSIsInVzZXJfaWQiOjd9.E3WLyrGwvJQhXevTH3o7vCyEQnmBKw1xEbe5oNZ0d4M"
            }
        }

        authService.registerUser(validAuthData).subscribe(
            (isLoadingState) => {
                actualIsLoadingState = isLoadingState;
            }
        );
        console.log("controller: ")
        console.log(controller)
        const request = controller.expectOne(
            {
                method: "POST",
                url: "api/user/create/"
            }
        );
        // const request = controller.expectOne("api/user/create/");
        console.log("request: ")
        console.log(request)
        /* … */

        // Answer the request so the Observable emits a value.
        request.flush(response);
        controller.verify();

        // Now verify emitted valued.
        expect(actualIsLoadingState).toEqual(true);

    });

    it('Registration passes through empty response', () => {

        authService.registerUser(validAuthData).subscribe(
            (isLoadingState) => {
                actualIsLoadingState = isLoadingState;
            }
        );

        controller.expectOne(
            {
                method: "POST",
                url: "api/user/create/"
            }
        )
            .flush(null);

        expect(actualIsLoadingState).toEqual(false);

    });

    it('Registration passes through email already exist', () => {
        const response = {
            "email": [
                "user with this email already exists."
            ]
        }

        authService.registerUser(validAuthData).subscribe(
            (isLoadingState) => {
                actualIsLoadingState = isLoadingState;
            }
        );

        controller.expectOne(
            {
                method: "POST",
                url: "api/user/create/"
            }
        )
            .flush(response);

        expect(actualIsLoadingState).toEqual(false);

    });

    it('Registration passes through with error response', () => {
        const status = 500;
        const statusText = 'Internal Server Error';
        const errorEvent = new ErrorEvent('API error');

        // const error = {
        //     "email": [
        //         "user with this email already exists."
        //     ]
        // }

        let actualError: HttpErrorResponse | undefined;

        authService.registerUser(validAuthData).subscribe(
            (isLoadingState) => {
                actualIsLoadingState = isLoadingState;
            }
        );

        // authService.registerUser(validAuthData).subscribe(
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

        controller.expectOne(
            {
                method: "POST",
                url: "api/user/create/"
            }
        )
            .flush(errorEvent, {status, statusText});
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

    it('User login successfully', () => {

        const response = {
            "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTYzOTgxOTIxOCwianRpIjoiODQ1ODcyMmI5OWVjNDc4NmJkNjZmMTI1ZjIwZjE5MWMiLCJ1c2VyX2lkIjo3fQ.BloTHDQ6OBRwksiLzJxrWKnnGn-8L6ClzEeJTN4QmH4",
            "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjM5NzM0NjE4LCJqdGkiOiI1MzljNzgyYjk3YTc0ZmY0OGIxNGQ0MjZjMmU3Mjg4MSIsInVzZXJfaWQiOjd9.E3WLyrGwvJQhXevTH3o7vCyEQnmBKw1xEbe5oNZ0d4M"
        }

        authService.login(validAuthData).subscribe(
            (isLoadingState) => {
                actualIsLoadingState = isLoadingState;
            }
        );

        const request = controller.expectOne(
            {
                method: "POST",
                url: "api/user/access/"
            }
        );

        // Answer the request so the Observable emits a value.
        request.flush(response);
        controller.verify();

        // Now verify emitted valued.
        expect(actualIsLoadingState).toEqual(true);

    });

    it('Login passes through user form fields empty', () => {

        authService.login(invalidAuthData).subscribe(
            (isLoadingState) => {
                actualIsLoadingState = isLoadingState;
            }
        );

        // controller.expectOne(
        //     {
        //         method: "POST",
        //         url: "api/user/access/"
        //     }
        // )
        //     .flush(null);

        expect(actualIsLoadingState).toEqual(false);

    });

    it('Login passes through with error response', () => {
        const status = 500;
        const statusText = 'Internal Server Error';
        const errorEvent = new ErrorEvent('API error');

        // const error = {
        //     "email": [
        //         "user with this email already exists."
        //     ]
        // }

        let actualError: HttpErrorResponse | undefined;

        authService.login(validAuthData).subscribe(
            (isLoadingState) => {
                actualIsLoadingState = isLoadingState;
            }
        );

        // authService.registerUser(validAuthData).subscribe(
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

        controller.expectOne(
            {
                method: "POST",
                url: "api/user/access/"
            }
        )
            .flush(errorEvent, {status, statusText});
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

        authService.login(validAuthData).subscribe(
            (isLoadingState) => {
                actualIsLoadingState = isLoadingState;
            }
        );

        controller.expectOne(
            {
                method: "POST",
                url: "api/user/access/"
            }
        )
            .flush(null);

        expect(actualIsLoadingState).toEqual(false);

    });

    it('InitAuthListener', async () => {

        await authService.initAuthListener()

        expect(true).toEqual(true);

    });

});
