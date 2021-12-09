import {Component, OnDestroy, OnInit} from '@angular/core';
import {TrainingService} from "../training.service";
import {Exercise} from "../exercise.model"
import {NgForm} from "@angular/forms";
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-new-training',
    templateUrl: './new-training.component.html',
    styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit, OnDestroy {
    // exercises: Observable<Exercise[]> =
    //     new Observable();
    exercises: Exercise[] = [];

    exerciseSubscription: Subscription =
        new Subscription();

    // exercises: Exercise[] = []

    constructor(
        private trainingService: TrainingService,
    ) {
    }

    ngOnInit(): void {
        this.exerciseSubscription =
            this.trainingService
                .exercisesChanged
                .subscribe(
                    exercises => {
                        this.exercises = exercises
                    },
                    (error) => {
                        console.log('error :', error)
                    }
                )

        this.trainingService
            .getAvailableExercises();

        // this.http
        //     .get(
        //         '/api/exercises/'
        //     ).subscribe(result => {
        //         console.log("result: ")
        //         console.log(result)
        // })

        // this.exercises = this.http
        //     .get<Exercise[]>(
        //         '/api/exercises/'
        //     )
    }

    onStartTraining(form: NgForm) {
        this.trainingService
            .startExercise(form.value.exercise)
    }

    ngOnDestroy() {
        this.exerciseSubscription.unsubscribe();
    }

}
