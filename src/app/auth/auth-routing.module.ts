import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {SignupComponent} from "./signup/signup.component";
import {AuthGuard} from "./auth.guard";
import {LoginComponent} from "./login/login.component";

const routes: Routes = [
    {
        path: 'signup',
        component: SignupComponent,
        // canActivate: [NegateAuthGuard]
        canActivate: [AuthGuard]
    },
    {
        path: 'login',
        component: LoginComponent,
        // canActivate: [NegateAuthGuard]
        canActivate: [AuthGuard]
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuthRoutingModule {

}
