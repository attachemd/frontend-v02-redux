import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { SharedModule } from '../shared/shared.module';

import { SignupComponent } from './signup/signup.component';
import { AuthRoutingModule } from './auth-routing.module';

@NgModule({
    declarations: [LoginComponent, SignupComponent],
    imports: [SharedModule, ReactiveFormsModule, AuthRoutingModule],
})
export class AuthModule {}
