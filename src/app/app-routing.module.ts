import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SignupComponent} from './auth/signup/signup.component';
import {WelcomeComponent} from "./welcome/welcome.component";
import {TrainingComponent} from "./training/training.component";
import {LoginComponent} from "./auth/login/login.component";
import {AuthGuard} from './auth/auth.guard';
import {NegateAuthGuard} from "./auth/negate-auth.guard";

const routes: Routes = [
    {path: '', component: WelcomeComponent},
    {path: 'signup', component: SignupComponent},
    {
        path: 'login',
        component: LoginComponent,
        // canActivate: [NegateAuthGuard]
    },
    {
        path: 'training',
        component: TrainingComponent,
        canActivate: [AuthGuard]
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [AuthGuard]
})
export class AppRoutingModule {
}
