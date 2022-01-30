import { Component, OnDestroy, OnInit } from '@angular/core';
import { TrainingService } from '../training.service';
import { FinishedExercise } from '../finished-exercise.model';
import { NgForm } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { UIService } from '../../shared/ui.service';
import * as fromTraining from '../state/training.reducer';
import * as fromRoot from '../../state/app.reducer';
import { Store } from '@ngrx/store';

@Component({
    selector: 'app-new-training',
    templateUrl: './new-training.component.html',
    styleUrls: ['./new-training.component.css'],
})
export class NewTrainingComponent implements OnInit, OnDestroy {
    // exercises: Observable<Exercise[]> =
    //     new Observable();
    // public isLoading: boolean = true;
    public isLoading$: Observable<boolean> = new Observable();
    private loadingSubscription: Subscription = new Subscription();
    // exercises: FinishedExercise[] | null = [];
    exercises$: Observable<FinishedExercise[] | null> = new Observable();

    exerciseSubscription: Subscription = new Subscription();

    // exercises: Exercise[] = []

    constructor(
        private trainingService: TrainingService,
        private uiService: UIService,
        private store: Store<fromTraining.State>
    ) {}

    ngOnInit(): void {
        this.isLoading$ = this.store.select(fromRoot.getIsLoading);
        this.exercises$ = this.store.select(fromTraining.getAvailableExercises);
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

        // this.exerciseSubscription =
        //     this.trainingService
        //         .exercisesChangedGetter()
        //         .subscribe(
        //             exercises => {
        //                 this.exercises = exercises
        //             },
        //             (error) => {
        //                 console.log('error :', error)
        //             }
        //         );

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

    public fetchExercises() {
        this.trainingService.getAvailableExercises();
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
        this.trainingService.startExercise(form.value.exercise);
    }

    ngOnDestroy() {
        this.exerciseSubscription.unsubscribe();
        this.loadingSubscription.unsubscribe();
    }
}
