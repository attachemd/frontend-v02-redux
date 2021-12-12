import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {WelcomeComponent} from "./welcome/welcome.component";

import {AuthGuard} from './auth/auth.guard';

const routes: Routes = [
    {
        path: '',
        component: WelcomeComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'training',
        // loadChildren: './training/training.module#TrainingModule'
        loadChildren: () => import('./training/training.module').then(_ => _.TrainingModule),
        canLoad: [AuthGuard]
    }

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [AuthGuard]
})
export class AppRoutingModule {
}
