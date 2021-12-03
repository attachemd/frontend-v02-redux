import {NgModule} from "@angular/core";
import {ReactiveFormsModule} from "@angular/forms";
import {LoginComponent} from "./login/login.component";
import {SharedModule} from "../shared/shared.module";

@NgModule({
    declarations: [
        LoginComponent
    ],
    imports: [
        SharedModule,
        ReactiveFormsModule
    ]
})

export class AuthModule {

}
