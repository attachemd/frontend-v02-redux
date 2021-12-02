import {Component, OnInit} from '@angular/core';
import {NgForm} from "@angular/forms";
import {AuthService} from "../auth.service";

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
    public maxDate: Date;
    constructor(private authService: AuthService) {
        this.maxDate = new Date();
    }

    ngOnInit(): void {
        this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
    }

    onSubmit(form: NgForm) {
           this.authService.registerUser({
               email: form.value.email,
               password: form.value.password
           })
    }

}
