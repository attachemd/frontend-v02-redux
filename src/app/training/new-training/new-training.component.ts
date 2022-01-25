import {Component, OnDestroy, OnInit} from '@angular/core';
import {TrainingService} from "../training.service";
import {FinishedExercise} from "../finished-exercise.model"
import {NgForm} from "@angular/forms";
import {Observable, Subscription} from 'rxjs';
import {UIService} from "../../shared/ui.service";
import * as fromRoot from "../../app.reducer";
import {Store} from "@ngrx/store";

@Component({
    selector: 'app-new-training',
    templateUrl: './new-training.component.html',
    styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit, OnDestroy {
    // exercises: Observable<Exercise[]> =
    //     new Observable();
    // public isLoading: boolean = true;
    public isLoading$: Observable<boolean> = new Observable();
    private loadingSubscription: Subscription = new Subscription();
    exercises: FinishedExercise[] | null = [];

    exerciseSubscription: Subscription =
        new Subscription();

    // exercises: Exercise[] = []

    constructor(
        private trainingService: TrainingService,
        private uiService: UIService,
        private store: Store<fromRoot.State>
    ) {
    }

    ngOnInit(): void {
        this.isLoading$ = this.store.select(fromRoot.getIsLoading)
        // this.loadingSubscription =
        //     this.uiService
        //         .loadingStateGetter()
        //         .subscribe(
        //             (isLoadingState) => {
        //                      this.isLoading = isLoadingState;
        //             },
        //             (error) => {
        //                 console.log('error :', error);
        //             }
        //         )
        this.exerciseSubscription =
            this.trainingService
                .exercisesChangedGetter()
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
            .getAvailableExercises()
            // .subscribe(
            //     (exercises: FinishedExercise[]) => {
            //         this.uiService.loadingStateNotifier(false);
            //         this.trainingService.availableExercises = exercises;
            //         this.trainingService.exercisesChangedNotifier(
            //             [
            //                 ...this.trainingService.availableExercises
            //             ]
            //         )
            //     },
            //     (error) => {
            //         console.log('error :', error)
            //         this.uiService.loadingStateNotifier(false);
            //         this.uiService.showSnackBar(
            //             "error when getting available exercises, try later.",
            //             undefined,
            //             3000
            //         );
            //         this.trainingService.exercisesChangedNotifier(
            //             null
            //         )
            //     }
            // )
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
