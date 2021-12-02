import {User} from "./user.model";
import {AuthData} from "./auth-data.model";
import {Subject} from "rxjs";
import { Router } from "@angular/router";
import {Injectable} from "@angular/core";

@Injectable()
export class AuthService {
    authChange: Subject<boolean> = new Subject<boolean>();
    private user: User = {
        email: "",
        userId: ""
    };

    constructor(private router: Router) {
    }


    public registerUser(authData: AuthData): void {
        this.user = {
            email: authData.email,
            userId: Math.round(Math.random() * 10000).toString()
        }
        this.authSuccessfully()
    }

    public login(authData: AuthData): void {
        this.user = {
            email: authData.email,
            userId: Math.round(Math.random() * 10000).toString()
        }
        this.authSuccessfully()
    }

    public logout(): void {
        this.user = {
            email: "",
            userId: ""
        };
        this.authChange.next(false);
        this.router.navigate(['/login'])
    }

    public getUser(): User {
        return {...this.user}
    }

    public isAuth(): boolean {
        return this.user !== {
            email: "",
            userId: ""
        };
    }

    private authSuccessfully(){
        this.authChange.next(true);
        this.router.navigate(['/training'])
    }

}
