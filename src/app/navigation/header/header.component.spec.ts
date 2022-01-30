import {
    ComponentFixture,
    fakeAsync,
    TestBed,
    tick,
} from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { AuthService } from '../../auth/auth.service';
import { Observable, of, Subject, throwError } from 'rxjs';
import { click, spyOnObj } from '../../spec-helpers/element.spec-helper';
import { ManagePeriodicTokenRefresh } from '../../auth/periodic-token-refresh.service';
import { AuthServiceMock } from '../../mocks';

describe('HeaderComponent', () => {
    let component: HeaderComponent;
    let fixture: ComponentFixture<HeaderComponent>;
    let authServiceSpy: Pick<AuthService, keyof AuthService>;
    // let authServiceSpy: Partial<AuthService>;
    // let authServiceSpy: AuthService;
    let managePeriodicTokenRefresh: ManagePeriodicTokenRefresh;

    // let spyOnObj = (mockClassName: any) => {
    //     for (let prop of Object.getOwnPropertyNames(mockClassName.prototype)) {
    //         if(prop !== "constructor"){
    //             spyOn(mockClassName.prototype, prop).and.callThrough();
    //         }
    //     }
    // }

    beforeEach(async () => {
        // let authChange$: Subject<boolean> = new Subject<boolean>();
        managePeriodicTokenRefresh = jasmine.createSpyObj(
            'ManagePeriodicTokenRefresh',
            {
                initPeriodicRefresh: undefined,
            }
        );
        let authChange$ = new Subject<boolean>();

        // authServiceSpy = createSpyObj(AuthServiceMock, authChange$)
        authServiceSpy = new AuthServiceMock(authChange$);
        spyOnObj(AuthServiceMock);

        // spyOn(authServiceSpy, 'getAuthChange').and.callThrough();
        // spyOn(authServiceSpy, 'authChangeNotifier').and.callThrough();
        // spyOn(authServiceSpy, 'registerUser').and.callThrough();
        // spyOn(authServiceSpy, 'login').and.callThrough();
        // spyOn(authServiceSpy, 'logout').and.callThrough();
        // spyOn(authServiceSpy, 'refreshTokenOrDie').and.callThrough();
        // spyOn(authServiceSpy, 'isBothTokensAlive').and.callThrough();
        // spyOn(authServiceSpy, 'isToken').and.callThrough();
        // spyOn(authServiceSpy, 'authState').and.callThrough();
        // spyOn(authServiceSpy, 'authSuccessfully').and.callThrough();

        await TestBed.configureTestingModule({
            declarations: [HeaderComponent],
            providers: [
                { provide: AuthService, useValue: authServiceSpy },
                {
                    provide: ManagePeriodicTokenRefresh,
                    useValue: managePeriodicTokenRefresh,
                },
            ],
        }).compileComponents();
        managePeriodicTokenRefresh = TestBed.inject(ManagePeriodicTokenRefresh);
        // authServiceSpy = TestBed.inject(AuthService)
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(HeaderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('Create component', () => {
        expect(component).toBeTruthy();
    });

    it('Subscribe on authChange$.next', async () => {
        let isAuthenticated = true;

        authServiceSpy.authChangeNotifier(isAuthenticated);
        expect(component.isAuthenticated).toEqual(true);
        expect(
            managePeriodicTokenRefresh.initPeriodicRefresh
        ).toHaveBeenCalled();
    });

    it('Pass subscription on authChange$.error', () => {
        let error = new Error('error');

        spyOn(window.console, 'log');
        // spyOn((<any>component).authService, 'getAuthChange').and.callThrough();
        // sut.initPeriodicRefresh()
        // (<any>component).authService.getAuthChange().error(error)
        authServiceSpy.getAuthChange().error(error);

        // spyOn<any>(authServiceSpy.authChange$, 'next')
        //     // .and.throwError('someError');
        //     .and.returnValue(throwError('someError'));
        // authServiceSpy.authChange$.error("any error")
        expect(console.log).toHaveBeenCalled();
    });

    it('Emit sidenavToggle events on onToggleSidenav', () => {
        let testVariable: boolean | undefined;

        component.sidenavToggle.subscribe(() => {
            testVariable = true;
        });

        click(fixture, 'menu-button');
        expect(testVariable).toBe(true);
    });

    it('authService.logout should be called when onLogout', () => {
        component.onLogout();
        expect(authServiceSpy.logout).toHaveBeenCalled();
    });
});
