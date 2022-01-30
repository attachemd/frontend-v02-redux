import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { TrainingService } from './training.service';
import { Store } from '@ngrx/store';
import * as fromTraining from './state/training.reducer';
import { log } from 'console';

@Component({
    selector: 'app-training',
    templateUrl: './training.component.html',
    styleUrls: ['./training.component.css'],
})
export class TrainingComponent implements OnInit, OnDestroy {
    public onGoingTraining$: Observable<boolean> = new Observable();
    private _exerciseSubscription: Subscription = new Subscription();

    constructor(private _store: Store<fromTraining.State>) {}

    ngOnInit(): void {
        this.onGoingTraining$ = this._store.select(fromTraining.getIsTraining);
        // this.exerciseSubscription = this.trainingService
        //     .exerciseChangedGetter()
        //     .subscribe(
        //         exercise => {
        //             this.onGoingTraining = !!exercise;
        //         },
        //         (error) => {
        //             console.log('error :', error)
        //         }
        //     )
    }

    ngOnDestroy() {
        // this.exerciseSubscription.unsubscribe();
        console.log('ngOnDestroy TrainingComponent');
    }
}
