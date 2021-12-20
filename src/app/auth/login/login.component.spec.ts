import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {LoginComponent} from './login.component';
import {ReactiveFormsModule} from "@angular/forms";
import {AuthService} from "../auth.service";
import {Observable, of, Subject} from "rxjs";
import {UIService} from "../../shared/ui.service";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {findEl, setFieldValue} from "../../spec-helpers/element.spec-helper";
import {AuthData} from "../auth-data.model";

fdescribe('LoginComponent', () => {
        let component: LoginComponent;
        let fixture: ComponentFixture<LoginComponent>;

        let authServiceSpy: jasmine.SpyObj<AuthService>;
        const uiServiceSpy = jasmine.createSpyObj(
            "UIService",
            {
                loadingStateNotifier: undefined,
                showSnackBar: undefined
            }
        );
        uiServiceSpy.loadingStateChange$ = new Subject<boolean>();

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
        }

        const fillForm = () => {

            setFieldValue(fixture, 'email', "test@test.com");
            setFieldValue(fixture, 'password', "password");
        };

        beforeEach(async () => {
            await setup();
        });

        beforeEach(() => {
            fixture = TestBed.createComponent(LoginComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();
        });

        it('should create',
            () => {

                expect(component).toBeTruthy();
            }
        );

        it('submits the form successfully',
            () => {
                fillForm();

                findEl(fixture, 'form').triggerEventHandler('submit', {});
                // tick(1000);
                fixture.detectChanges();
                expect(authServiceSpy.login).toHaveBeenCalled();
            }
        );
    }
);
