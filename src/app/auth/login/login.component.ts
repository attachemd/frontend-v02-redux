import {Component, OnInit} from '@angular/core';
import {AuthService} from '../auth.service';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {UIService} from "../../shared/ui.service";
import {Observable, Subscription} from "rxjs";
import {map} from 'rxjs/operators'
import {Store} from "@ngrx/store";
import * as fromRoot from "../../state/app.reducer";
import * as AUTH from "../state/auth.actions";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    public loginForm: FormGroup = new FormGroup({});
    // public isLoading: boolean = false;
    public isLoading$: Observable<boolean> = new Observable();

    // private loadingSubscription: Subscription = new Subscription();

    constructor(
        private authService: AuthService,
        private uiService: UIService,
        private store: Store<fromRoot.State>
    ) {

    }


    ngOnInit(): void {
        console.log(
            '%c next component',
            'background: green; color: #fff; padding: 100px;'
        );
        this.isLoading$ = this.store.select(fromRoot.getIsLoading)
        // this.loadingSubscription =
        //     this.uiService
        //         .loadingStateGetter()
        //         // .loadingStateChange$
        //         .subscribe(
        //             (isLoadingState) => {
        //                 this.isLoading = isLoadingState;
        //                 console.log("🍄, 🍕, 🍅, 🧀, 🌶️")
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
                    // this.authService.authChangeNotifier(isLogin);
                    if (isLogin) {
                        this.authService.authSuccessfully()
                    } else {
                        this.store.dispatch(new AUTH.SetUnauthenticated());
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

    // ngOnDestroy() {
    //     this.loadingSubscription.unsubscribe()
    // }

}
