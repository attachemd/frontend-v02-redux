import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../auth.service';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {UIService} from "../../shared/ui.service";
import {Subscription} from "rxjs";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
    public loginForm: FormGroup = new FormGroup({});
    public isLoading: boolean = false;
    private loadingSubscription: Subscription = new Subscription();

    constructor(
        private authService: AuthService,
        private uiService: UIService
    ) {
        console.log(
            '%c next component',
            'background: green; color: #fff; padding: 100px;'
        );
        this.loadingSubscription =
            this.uiService
                .loadingStateChange$
                .subscribe(
                    (isLoadingState) => {
                        this.isLoading = isLoadingState;
                    },
                    (error) => {
                        console.log('error :', error)
                    }
                )
    }


    ngOnInit(): void {
        // this.loadingSubscription =
        //     this.uiService
        //         .loadingStateChange$
        //         .subscribe(
        //             (isLoadingState) => {
        //                     this.isLoading = isLoadingState;
        //             },
        //             (error) => {
        //                 console.log('error :', error)
        //             }
        //         )
        this.loginForm = new FormGroup(
            {
                email: new FormControl(
                    '',
                    {
                        validators: [
                            Validators.required,
                            Validators.email
                        ]
                    }
                ),
                password: new FormControl(
                    '',
                    {
                        validators:
                            [
                                Validators.required
                            ]
                    }
                )
            }
        )
    }

    onSubmit(): void {
        if (!this.loginForm.valid) {
            return;
        }
        this.authService.login({
            email: this.loginForm.value.email,
            password: this.loginForm.value.password
        })
            .subscribe(
                isLogin => {
                    console.log(
                        '%c login subscribe: ',
                        'background: white; ' +
                        'color: #000; ' +
                        'padding: 10px; ' +
                        'border: 1px solid red'
                    );
                    console.log(isLogin)
                    this.authService.authChangeNotifier(isLogin);
                    if (isLogin) {
                        this.authService.authSuccessfully()
                    }
                },
                error => {
                    console.log('error');
                    console.log(error);
                    this.uiService.showSnackBar(
                        "error when login",
                        undefined,
                        3000
                    );
                }
            )
    }

    ngOnDestroy() {
        this.loadingSubscription.unsubscribe()
    }

}
