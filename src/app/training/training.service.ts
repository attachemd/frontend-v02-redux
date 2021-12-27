import {of, Subject} from "rxjs";
import {FinishedExercise} from "./finished-exercise.model";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {UIService} from "../shared/ui.service";
import {catchError, map} from "rxjs/operators";

@Injectable()
export class TrainingService {
    private exerciseChanged$: Subject<FinishedExercise> =
        new Subject<FinishedExercise>();

    private exercisesChanged$: Subject<FinishedExercise[] | null> =
        new Subject<FinishedExercise[] | null>();

    /**
     * notify if finished exercises changed
     * @type {Subject<FinishedExercise[]>}
     * @private
     */
    private finishedExercisesChanged$: Subject<FinishedExercise[]> =
        new Subject<FinishedExercise[]>();

    private availableExercises: FinishedExercise[] = [];

    private runningExercise: FinishedExercise | undefined;

    constructor(
        private http: HttpClient,
        private uiService: UIService
    ) {
    }

    public exerciseChangedNotifier(finishedExercise:FinishedExercise | undefined): void {
        this.exerciseChanged$.next(finishedExercise);
    }

    public exerciseChangedGetter(): Subject<FinishedExercise> {
        return this.exerciseChanged$;
    }

    public exercisesChangedNotifier(finishedExercises:FinishedExercise[] | null): void {
        this.exercisesChanged$.next(finishedExercises);
    }

    public exercisesChangedGetter(): Subject<FinishedExercise[] | null> {
        return this.exercisesChanged$;
    }

    public finishedExercisesChangedNotifier(finishedExercises:FinishedExercise[]): void {
        this.finishedExercisesChanged$.next(finishedExercises);
    }

    public finishedExercisesChangedGetter(): Subject<FinishedExercise[]> {
        return this.finishedExercisesChanged$;
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
                    this.uiService.loadingStateNotifier(false);
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
                    this.availableExercises = exercises;
                    this.exercisesChangedNotifier(
                            [
                                ...this.availableExercises
                            ]
                        )
                },
                (error) => {
                    console.log('error :', error)
                    this.uiService.loadingStateNotifier(false);
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
        this.runningExercise = this.availableExercises.find(
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
                ...this.runningExercise
            }
        )
    }

    public completeExercise() {
        // if (this.runningExercise) {
        //     this.exercises.push(
        //         {
        //             ...this.runningExercise,
        //             date: new Date(),
        //             state: "completed"
        //         }
        //     );
        // }
        this.addDataToDatabase(
            {
                calories: 0,
                duration: 0,
                id: "",
                name: "",
                ...this.runningExercise,
                state: "completed"
            }
        );
        this.runningExercise = undefined;
        this.exerciseChangedNotifier(undefined)
    }

    public cancelExercise(progress: number) {
        if (this.runningExercise) {
            this.addDataToDatabase(
                {
                    ...this.runningExercise,
                    calories: Math.round((
                        this.runningExercise.duration * progress
                    ) / 100),
                    duration: Math.round((
                        this.runningExercise.calories * progress
                    ) / 100),
                    date: new Date(),
                    state: "cancelled"
                }
            );
        }
        this.runningExercise = undefined;
        this.exerciseChangedNotifier(undefined)
    }

    public getRunningExercise() {
        return {...this.runningExercise};
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

    private addDataToDatabase(exercise: FinishedExercise) {
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
