import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgForm} from "@angular/forms";
import {AuthService} from "../auth.service";
import {UIService} from "../../shared/ui.service";
import {Subscription} from "rxjs";

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
    public maxDate: Date;
    public isLoading: boolean = false;
    private loadingSubscription: Subscription = new Subscription()

    constructor(
        private authService: AuthService,
        private uiService: UIService
    ) {
        this.maxDate = new Date();
    }

    ngOnInit(): void {
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
        this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
    }

    onSubmit(form: NgForm) {
        this.authService.registerUser({
            email: form.value.email,
            password: form.value.password
        })
            .subscribe(
                (result) => {
                    if (result) {
                        this.authService.authSuccessfully()
                    }
                },
                (error) => {
                    console.log('error :', error)
                    this.uiService.showSnackBar(
                        "error when register",
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
