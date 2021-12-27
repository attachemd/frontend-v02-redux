import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {TrainingService} from './training.service';

@Component({
    selector: 'app-training',
    templateUrl: './training.component.html',
    styleUrls: ['./training.component.css']
})
export class TrainingComponent implements OnInit, OnDestroy {
    onGoingTraining = false;
    exerciseSubscription: Subscription = new Subscription();

    constructor(private trainingService: TrainingService) {
    }

    ngOnInit(): void {
        this.exerciseSubscription = this.trainingService
            .exerciseChangedGetter()
            .subscribe(
                exercise => {
                    this.onGoingTraining = !!exercise;
                },
                (error) => {
                    console.log('error :', error)
                }
            )
    }

    ngOnDestroy() {
        this.exerciseSubscription.unsubscribe();
    }

}
