import {AuthService} from "./auth.service";
import {TestBed} from "@angular/core/testing";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {JwtHelperService, JwtModule} from "@auth0/angular-jwt";
import {UIService} from "../shared/ui.service";
import {of} from "rxjs";

const authData = {
    email: "test@test.com",
    password: "password"
}
const uiServiceSpy = jasmine.createSpyObj(
    "UIService",
    {
        loadingStateNotifier: undefined
    }
);

describe('AuthService', () => {
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

    it('searches for public photos', () => {
        authService.registerUser(authData).subscribe(
            (actualPhotos) => {
                /* … */
            }
        );
        console.log("controller: ")
        console.log(controller)
        const request = controller.expectOne("api/user/create/");
        /* … */
    });
});
