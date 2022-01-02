import {AuthData} from "../auth/auth-data.model";
import {Observable, of, Subject} from "rxjs";
import {FinishedExercise} from "../training/finished-exercise.model";

export const validUser: AuthData = {
    email: 'test@example.com',
    password: '123456'
};

export const blankUser: AuthData = {
    email: '',
    password: ''
};

export class AuthServiceMock {
    constructor(private authChange$: Subject<boolean>) {
    }

    getAuthChange(): Subject<boolean>{
        return this.authChange$;
    }

    authChangeNotifier(isAuthenticated:boolean): void {
        this.authChange$.next(isAuthenticated)
    }

    registerUser(): Observable<boolean> {
        return of(true);
    }

    login(): Observable<boolean> {
        return of(true);
    }

    logout(): void {
    }

    refreshTokenOrDie(): Observable<boolean> {
        return of(true);
    }

    isBothTokensAlive(): Observable<boolean> {
        return of(true);
    }

    isToken(): boolean {
        return true;
    }

    authState(): Observable<boolean> {
        return of(true);
    }

    authSuccessfully(): void {
    }
}

export class TrainingServiceMock {
    constructor(private authChange$: Subject<FinishedExercise>) {
    }

}
