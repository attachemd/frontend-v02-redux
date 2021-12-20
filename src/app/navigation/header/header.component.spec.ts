import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {HeaderComponent} from './header.component';
import {AuthService} from "../../auth/auth.service";
import {Observable, of, Subject, throwError} from "rxjs";
import {AuthData} from "../../auth/auth-data.model";
import {click} from "../../spec-helpers/element.spec-helper";

describe('HeaderComponent', () => {
    let component: HeaderComponent;
    let fixture: ComponentFixture<HeaderComponent>;
    let authServiceSpy: Pick<AuthService, keyof AuthService>;

    beforeEach(async () => {
        // let authChange$: Subject<boolean> = new Subject<boolean>();
        authServiceSpy = {
            authChange$: new Subject<boolean>(),
            authChangeNotifier(): void {
            },
            registerUser(): Observable<boolean> {
                return of(true);
            },
            login(): Observable<boolean> {
                return of(true);
            },
            logout(): void {
            },
            refreshTokenOrDie(): Observable<boolean> {
                return of(true);
            },
            isBothTokensAlive(): Observable<boolean> {
                return of(true);
            },
            isToken(): boolean {
                return true;
            },
            authState(): Observable<boolean> {
                return of(true);
            },
            authSuccessfully(): void {
            },
        };
        spyOn(authServiceSpy, 'authChangeNotifier').and.callThrough();
        spyOn(authServiceSpy, 'registerUser').and.callThrough();
        spyOn(authServiceSpy, 'login').and.callThrough();
        spyOn(authServiceSpy, 'logout').and.callThrough();
        spyOn(authServiceSpy, 'refreshTokenOrDie').and.callThrough();
        spyOn(authServiceSpy, 'isBothTokensAlive').and.callThrough();
        spyOn(authServiceSpy, 'isToken').and.callThrough();
        spyOn(authServiceSpy, 'authState').and.callThrough();
        spyOn(authServiceSpy, 'authSuccessfully').and.callThrough();
        // authServiceSpy.authChange$ = authChange$;
        await TestBed.configureTestingModule({
            declarations: [HeaderComponent],
            providers: [
                {provide: AuthService, useValue: authServiceSpy}
            ],
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(HeaderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('Create component', () => {
        expect(component).toBeTruthy();
    });

    // it('Create component 2',
    //     fakeAsync(async () => {
    //         let isAuthenticated = true;
    //         await authServiceSpy.authChangeNotifier(isAuthenticated);
    //         tick(1000);
    //         fixture.detectChanges();
    //         expect(component.isAuthenticated).toEqual(true);
    //     })
    // );

    it('Subscribe on authChange$.next',
         () => {
            let isAuthenticated = true;
            // authServiceSpy.authChangeNotifier(isAuthenticated);
            // tick(1000);
            // fixture.detectChanges();
            authServiceSpy.authChange$.next(isAuthenticated)
            expect(component.isAuthenticated).toEqual(true);
        }
    );

    it('Pass subscription on authChange$.error ',
         () => {
            spyOn<any>(authServiceSpy.authChange$, 'next')
                // .and.throwError('someError');
                .and.returnValue(throwError('someError'));
            spyOn(window.console, 'log')
            authServiceSpy.authChange$.error("any error")
            expect(console.log).toHaveBeenCalled();
        }
    );

    it('Emit sidenavToggle events on onToggleSidenav',
         () => {
             let testVariable: boolean | undefined;
             component.sidenavToggle.subscribe(() => {
                 testVariable = true
             });

             click(fixture, 'menu-button');
             expect(testVariable).toBe(true);
        }
    );

    it('authService.logout should be called when onLogout',
         () => {
             component.onLogout();
             expect(authServiceSpy.logout).toHaveBeenCalled();
        }
    );
});
