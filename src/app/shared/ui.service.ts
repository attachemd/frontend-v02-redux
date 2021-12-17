import {Subject} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Injectable} from "@angular/core";

@Injectable()
export class UIService {
    loadingStateChange$: Subject<boolean> = new Subject<boolean>();

    constructor(private snackBar: MatSnackBar) {
    }

    showSnackBar(
        message: string,
        action: string|undefined,
        duration: number
    ){
        this.snackBar.open(message, action, {
            duration: duration
        })
    }

    public loadingStateNotifier(isLoadingState: boolean){
        this.loadingStateChange$.next(isLoadingState);
    }
}
