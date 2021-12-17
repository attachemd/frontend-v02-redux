import {Component, OnDestroy, OnInit} from '@angular/core';
import {TrainingService} from "../training.service";
import {FinishedExercise} from "../finished-exercise.model"
import {NgForm} from "@angular/forms";
import {Subscription} from 'rxjs';
import {UIService} from "../../shared/ui.service";

@Component({
    selector: 'app-new-training',
    templateUrl: './new-training.component.html',
    styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit, OnDestroy {
    // exercises: Observable<Exercise[]> =
    //     new Observable();
    public isLoading: boolean = true;
    private loadingSubscription: Subscription = new Subscription();
    exercises: FinishedExercise[] | null = [];

    exerciseSubscription: Subscription =
        new Subscription();

    // exercises: Exercise[] = []

    constructor(
        private trainingService: TrainingService,
        private uiService: UIService
    ) {
    }

    ngOnInit(): void {
        this.loadingSubscription =
            this.uiService
                .loadingStateChange$
                .subscribe(
                    (isLoadingState) => {
                             this.isLoading = isLoadingState;
                    },
                    (error) => {
                        console.log('error :', error);
                    }
                )
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
                );

        this.fetchExercises();

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

    public fetchExercises()  {
        this.trainingService
            .getAvailableExercises();
    }

    onStartTraining(form: NgForm) {
        this.trainingService
            .startExercise(form.value.exercise)
    }

    ngOnDestroy() {
        this.exerciseSubscription.unsubscribe();
        this.loadingSubscription.unsubscribe();
    }

}
