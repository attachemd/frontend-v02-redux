import {Subject} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Injectable} from "@angular/core";

@Injectable()
export class UIService {
    public loadingStateChange$: Subject<boolean> = new Subject<boolean>();
    // public readonly loadingStateChangeData$ = this.loadingStateChange$.asObservable();

    constructor(private snackBar: MatSnackBar) {
    }

    showSnackBar(
        message: string,
        action: string|undefined,
        duration: number
    ){
        console.log("🤕 🤑 🤠");
        this.snackBar.open(message, action, {
            duration: duration
        })
    }

    public loadingStateNotifier(isLoadingState: boolean){
        console.log("🍕, 🍅, 🧀, 🌶️, 🍄")
        this.loadingStateChange$.next(isLoadingState);
    }

    public loadingStateGetter(){
        return this.loadingStateChange$;
    }
}
