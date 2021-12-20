import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {LoginComponent} from './login.component';
import {ReactiveFormsModule} from "@angular/forms";
import {AuthService} from "../auth.service";
import {Observable, of, Subject, Subscription, throwError} from "rxjs";
import {UIService} from "../../shared/ui.service";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {findEl, setFieldValue} from "../../spec-helpers/element.spec-helper";
import {AuthData} from "../auth-data.model";
import {blankUser, validUser} from "../../mocks";

describe('LoginComponent', () => {
        let component: LoginComponent;
        let fixture: ComponentFixture<LoginComponent>;

        let authServiceSpy: jasmine.SpyObj<AuthService>;
        let uiServiceSpy = {
            ...jasmine.createSpyObj(
                "UIService",
                {
                    loadingStateNotifier: undefined,
                    showSnackBar: undefined
                }
            ),
            loadingStateChange$: new Subject<boolean>()
        };

        // const uiServiceSpy = jasmine.createSpyObj(
        //     "UIService",
        //     {
        //         loadingStateNotifier: undefined,
        //         showSnackBar: undefined
        //     }
        // );
        // uiServiceSpy.loadingStateChange$ = new Subject<boolean>();

        // let uiService = TestBed.get(UIService)
        // const loadingStateChange$NextSpy = spyOn(uiService.loadingStateChange$, 'next');

        const setup = async (
            signupServiceReturnValues?: jasmine.SpyObjMethodNames<AuthService>,
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
                    ...signupServiceReturnValues,
                }
            );

            await TestBed.configureTestingModule({
                imports: [
                    BrowserAnimationsModule,
                    ReactiveFormsModule,
                    MatFormFieldModule,
                    MatInputModule
                ],
                declarations: [LoginComponent],
                providers: [
                    {provide: AuthService, useValue: authServiceSpy},
                    {provide: UIService, useValue: uiServiceSpy},
                ],
            })
                .compileComponents();

            fixture = TestBed.createComponent(LoginComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();

        }

        const fillForm = (userData:AuthData=validUser) => {

            setFieldValue(fixture, 'email', userData.email);
            setFieldValue(fixture, 'password', userData.password);
        };

        beforeEach(async () => {
            // await setup();
        });

        beforeEach(() => {
            // fixture = TestBed.createComponent(LoginComponent);
            // component = fixture.componentInstance;
            // fixture.detectChanges();
        });

        it('should create',
            async () => {
                await setup();
                // let loadingStateChange$NextSpy = spyOn(uiServiceSpy.loadingStateChange$, 'next');
                //     // .and.throwError('someError');
                //     // .and.returnValue(throwError('someError'));
                expect(component).toBeTruthy();
                expect(findEl(fixture, 'submit').properties.disabled).toBe(true);
                // expect(loadingStateChange$NextSpy).toHaveBeenCalled();
            }
        );

        it('submits the form successfully',
            async () => {
                await setup();

                fillForm();

                findEl(fixture, 'form').triggerEventHandler('submit', {});
                // tick(1000);

                expect(authServiceSpy.login).toHaveBeenCalledWith(validUser);
                expect(authServiceSpy.authChangeNotifier).toHaveBeenCalledWith(true);
                expect(authServiceSpy.authSuccessfully).toHaveBeenCalled();
                fixture.detectChanges();
                expect(findEl(fixture, 'submit').properties.disabled).toBe(false);
            }
        );

        it('does not submit an invalid form',
            async () => {
                await setup();
                findEl(fixture, 'form').triggerEventHandler('submit', {});
                expect(authServiceSpy.login).not.toHaveBeenCalled();
                expect(authServiceSpy.authChangeNotifier).not.toHaveBeenCalled();
                expect(authServiceSpy.authSuccessfully).not.toHaveBeenCalled();
            }
        );

        it('login sends falsy value when server response not valid',
            async () => {
                await setup({
                    // Let the API report a failure
                    login: of(false),
                });
                fillForm();
                findEl(fixture, 'form').triggerEventHandler('submit', {});
                expect(authServiceSpy.login).toHaveBeenCalled();
                expect(authServiceSpy.authChangeNotifier).toHaveBeenCalled();
                expect(authServiceSpy.authSuccessfully).not.toHaveBeenCalled();
            }
        );

        it('handles signup failure', async () => {
            await setup({
                // Let the API report a failure
                login: throwError(new Error('Validation failed')),
            });

            fillForm();

            // Wait for async validators
            // tick(1000);

            findEl(fixture, 'form').triggerEventHandler('submit', {});
            fixture.detectChanges();
            expect(authServiceSpy.login).toHaveBeenCalled();
            expect(uiServiceSpy.showSnackBar).toHaveBeenCalled();

        });

        it("When username is blank, username field should display red outline ",
            async () => {
                await setup();
                fillForm(blankUser);
                fixture.detectChanges();
                const button = fixture.debugElement.nativeElement.querySelector("button");
                button.click();
                fixture.detectChanges();

                // const inputs = fixture.debugElement.nativeElement.querySelectorAll("input");
                // const usernameInput = inputs[0];

                const emailInput = findEl(fixture, 'email').nativeElement;

                expect(emailInput.classList).toContain("ng-invalid");
            }
        );

        it('Subscribe on uiServiceSpy.loadingStateChange$.next',
            fakeAsync(async () => {
                await setup();
                let isLoadingState = true;
                // authServiceSpy.authChangeNotifier(isAuthenticated);
                // tick(1000);
                // fixture.detectChanges();
                uiServiceSpy.loadingStateChange$.next(isLoadingState)
                tick()
                expect(component.isLoading).toEqual(true);
            })
        );

        it('Pass subscription on uiServiceSpy.loadingStateChange$.next ',
            async () => {
                await setup();
                spyOn(uiServiceSpy.loadingStateChange$, 'next')
                    .and.returnValue(throwError('someError'));
                spyOn(window.console, 'log')
                uiServiceSpy.loadingStateChange$.error("any error")
                expect(console.log).toHaveBeenCalled();
            }
        );

        it('unsubscribe from loadingSubscription',
            async () => {
                await setup();

                spyOn(component['loadingSubscription'], 'unsubscribe');
                component.ngOnDestroy();
                expect(component['loadingSubscription'].unsubscribe).toHaveBeenCalledTimes(1);
            }
        );

    }
);
