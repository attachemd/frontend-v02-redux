import {Component, OnInit} from '@angular/core';
import {AuthService} from '../auth.service';
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    public loginForm: FormGroup = new FormGroup({});

    constructor(private authService: AuthService) {
    }

    ngOnInit(): void {
        this.loginForm = new FormGroup({
            email: new FormControl('', {validators: [Validators.required, Validators.email]}),
            password: new FormControl('', {validators: [Validators.required]})
        })
    }

    onSubmit(): void {
        this.authService.login({
            email: this.loginForm.value.email,
            password: this.loginForm.value.password
        });
    }

}
