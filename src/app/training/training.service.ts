import {of, Subject} from "rxjs";
import {FinishedExercise} from "./finished-exercise.model";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {UIService} from "../shared/ui.service";
import {catchError, map} from "rxjs/operators";
import {Store} from "@ngrx/store";
import * as fromRoot from "../app.reducer";
import * as UI from "../shared/ui.actions";

@Injectable()
export class TrainingService {
    private _exerciseChanged$: Subject<FinishedExercise> =
        new Subject<FinishedExercise>();

    private _exercisesChanged$: Subject<FinishedExercise[] | null> =
        new Subject<FinishedExercise[] | null>();

    /**
     * notify if finished exercises changed
     * @type {Subject<FinishedExercise[]>}
     * @private
     */
    private _finishedExercisesChanged$: Subject<FinishedExercise[]> =
        new Subject<FinishedExercise[]>();

    private _availableExercises: FinishedExercise[] = [];

    private _runningExercise: FinishedExercise | undefined;

    constructor(
        private http: HttpClient,
        private uiService: UIService,
        private store: Store<fromRoot.State>
    ) {
    }

    public exerciseChangedNotifier(finishedExercise:FinishedExercise | undefined): void {
        this._exerciseChanged$.next(finishedExercise);
    }

    public exerciseChangedGetter(): Subject<FinishedExercise> {
        return this._exerciseChanged$;
    }

    public exercisesChangedNotifier(finishedExercises:FinishedExercise[] | null): void {
        this._exercisesChanged$.next(finishedExercises);
    }

    public exercisesChangedGetter(): Subject<FinishedExercise[] | null> {
        return this._exercisesChanged$;
    }

    public finishedExercisesChangedNotifier(finishedExercises:FinishedExercise[]): void {
        this._finishedExercisesChanged$.next(finishedExercises);
    }

    public finishedExercisesChangedGetter(): Subject<FinishedExercise[]> {
        return this._finishedExercisesChanged$;
    }

    public getAvailableExercises() {
        console.log("getAvailableExercises");
        return this.http
            .get<FinishedExercise[]>(
                '/api/exercises/'
            )
            // .pipe(
            //     map(
            //         (exercises: FinishedExercise[]) => {
            //             return exercises;
            //         }),
            //     catchError((error) => {
            //         // this.uiService.loadingStateNotifier(false);
            //         console.log('error');
            //         console.log(error);
            //         // this.uiService.showSnackBar(
            //         //     error.error.detail,
            //         //     undefined,
            //         //     3000
            //         // );
            //         return of(error);
            //     })
            // )
            .subscribe(
                (exercises: FinishedExercise[]) => {
                    // this.uiService.loadingStateNotifier(false);
                    // this.store.dispatch({type: 'STOP_LOADING'});
                    this.store.dispatch(new UI.StopLoading());
                    if(exercises.length === 0){
                        // throw {
                        //     error: {
                        //         detail: "no exercise is available"
                        //     }
                        // };
                        this.uiService.showSnackBar(
                            "no exercise is available",
                            undefined,
                            3000
                        );
                    }
                    this._availableExercises = exercises;
                    this.exercisesChangedNotifier(
                            [
                                ...this._availableExercises
                            ]
                        )
                },
                (error) => {
                    console.log('error :', error)
                    // this.uiService.loadingStateNotifier(false);
                    // this.store.dispatch({type: 'STOP_LOADING'});
                    this.store.dispatch(new UI.StopLoading());
                    this.uiService.showSnackBar(
                        "error when getting available exercises, try later.",
                        undefined,
                        3000
                    );
                    this.exercisesChangedNotifier(
                            null
                        )
                }
            )
    }

    public startExercise(selectedExerciseId: string) {
        this._runningExercise = this._availableExercises.find(
            ex => ex.id === selectedExerciseId
        )
        this.exerciseChangedNotifier(
            {
                calories: 0,
                date: undefined,
                duration: 0,
                id: "",
                name: "",
                state: undefined,
                ...this._runningExercise
            }
        )
    }

    public completeExercise() {
        // if (this._runningExercise) {
        //     this.exercises.push(
        //         {
        //             ...this._runningExercise,
        //             date: new Date(),
        //             state: "completed"
        //         }
        //     );
        // }
        this._addDataToDatabase(
            {
                calories: 0,
                duration: 0,
                id: "",
                name: "",
                ...this._runningExercise,
                state: "completed"
            }
        );
        this._runningExercise = undefined;
        this.exerciseChangedNotifier(undefined)
    }

    public cancelExercise(progress: number) {
        if (this._runningExercise) {
            this._addDataToDatabase(
                {
                    ...this._runningExercise,
                    calories: Math.round((
                        this._runningExercise.duration * progress
                    ) / 100),
                    duration: Math.round((
                        this._runningExercise.calories * progress
                    ) / 100),
                    date: new Date(),
                    state: "cancelled"
                }
            );
        }
        this._runningExercise = undefined;
        this.exerciseChangedNotifier(undefined)
    }

    public getRunningExercise() {
        return {...this._runningExercise};
    }

    public getCompletedOrCanceledExercises() {
        return this.http
            .get<FinishedExercise[]>(
                '/api/fexercises/'
            )
            .subscribe(
                (exercises: FinishedExercise[]) => {
                    this.finishedExercisesChangedNotifier([
                            ...exercises
                        ])
                },
                (error) => {
                    console.log('error :', error)
                }
            )
    }

    private _addDataToDatabase(exercise: FinishedExercise) {
        // let id = exercise.id;
        let {id, date, ...payload} = exercise;

        console.log("payload: ");
        console.log(payload);
        this.http
            .post('/api/fexercises/'+exercise.id+'/', payload)
            .subscribe(
                response => {
                    console.log(response)
                    // this.getAvailableExercises();
                    this.getCompletedOrCanceledExercises()
                },
                err => console.log(err)
            );
    }

}
