import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {HeaderComponent} from './header.component';
import {AuthService} from "../../auth/auth.service";
import {Observable, of, Subject, throwError} from "rxjs";
import {click} from "../../spec-helpers/element.spec-helper";
import {ManagePeriodicTokenRefresh} from "../../auth/periodic-token-refresh.service";


fdescribe('HeaderComponent', () => {

    let component: HeaderComponent;
    let fixture: ComponentFixture<HeaderComponent>;
    // let authServiceSpy: Pick<AuthService, keyof AuthService>;
    // let authServiceSpy: Partial<AuthService>;
    let authServiceSpy: AuthService;
    let managePeriodicTokenRefresh: ManagePeriodicTokenRefresh


    beforeEach(async () => {
        // let authChange$: Subject<boolean> = new Subject<boolean>();
        managePeriodicTokenRefresh = jasmine.createSpyObj(
            "ManagePeriodicTokenRefresh",
            {
                initPeriodicRefresh: undefined
            }
        );

        // authServiceSpy = {
        //     // authChange$: new Subject<boolean>(),
        //     getAuthChange(): Subject<boolean>{
        //         return new Subject<boolean>();
        //     },
        //     authChangeNotifier(): void {
        //     },
        //     registerUser(): Observable<boolean> {
        //         return of(true);
        //     },
        //     login(): Observable<boolean> {
        //         return of(true);
        //     },
        //     logout(): void {
        //     },
        //     refreshTokenOrDie(): Observable<boolean> {
        //         return of(true);
        //     },
        //     isBothTokensAlive(): Observable<boolean> {
        //         return of(true);
        //     },
        //     isToken(): boolean {
        //         return true;
        //     },
        //     authState(): Observable<boolean> {
        //         return of(true);
        //     },
        //     authSuccessfully(): void {
        //     },
        // };
        // spyOn(authServiceSpy, 'authChangeNotifier').and.callThrough();
        // spyOn(authServiceSpy, 'registerUser').and.callThrough();
        // spyOn(authServiceSpy, 'login').and.callThrough();
        // spyOn(authServiceSpy, 'logout').and.callThrough();
        // spyOn(authServiceSpy, 'refreshTokenOrDie').and.callThrough();
        // spyOn(authServiceSpy, 'isBothTokensAlive').and.callThrough();
        // spyOn(authServiceSpy, 'isToken').and.callThrough();
        // spyOn(authServiceSpy, 'authState').and.callThrough();
        // spyOn(authServiceSpy, 'authSuccessfully').and.callThrough();

        authServiceSpy = jasmine.createSpyObj<AuthService>(
            'AuthService',
            {
                // Successful responses per default
                authChangeNotifier: undefined,
                // getAuthChange: new Subject(),
                registerUser: of(true),
                login: of(true),
                logout: undefined,
                refreshTokenOrDie: of(true),
                isBothTokensAlive: of(true),
                isToken: true,
                authState: of(true),
                authSuccessfully: undefined,
                // Overwrite with given return values
            }
        )
        await TestBed.configureTestingModule({
            declarations: [HeaderComponent],
            providers: [
                {provide: AuthService, useValue: authServiceSpy},
                {provide: ManagePeriodicTokenRefresh, useValue: managePeriodicTokenRefresh}
            ],
        })
            .compileComponents();
        managePeriodicTokenRefresh = TestBed.inject(ManagePeriodicTokenRefresh)
        authServiceSpy = TestBed.inject(AuthService)
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(HeaderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('Create component', () => {
        expect(component).toBeTruthy();
    });

    it('Subscribe on authChange$.next',
       async () => {
            let isAuthenticated = true;
            // component.ngOnInit();
            // authServiceSpy.authChangeNotifier(isAuthenticated)
           spyOn((<any>component).authService, 'getAuthChange').and.callThrough();
            (<any>component).authService.authChangeNotifier(isAuthenticated)
            // tick()

            expect(component.isAuthenticated).toEqual(true);
            expect(managePeriodicTokenRefresh.initPeriodicRefresh).toHaveBeenCalled();
            // fixture.whenStable().then(() => {
            //     fixture.detectChanges()
            //     expect(component.isAuthenticated).toEqual(true);
            //     expect(managePeriodicTokenRefresh.initPeriodicRefresh).toHaveBeenCalled();
            // });

        }
    );

    it('Pass subscription on authChange$.error',
        () => {
            let error = new Error('error');
            spyOn(window.console, 'log');
            spyOn((<any>component).authService, 'getAuthChange').and.callThrough();
            // sut.initPeriodicRefresh()
            (<any>component).authService.getAuthChange().error(error)
            // authServiceSpy.getAuthChange().error(error)

            // spyOn<any>(authServiceSpy.authChange$, 'next')
            //     // .and.throwError('someError');
            //     .and.returnValue(throwError('someError'));
            // authServiceSpy.authChange$.error("any error")
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
