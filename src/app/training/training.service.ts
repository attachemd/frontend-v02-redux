import {Subject} from "rxjs";
import {FinishedExercise} from "./finished-exercise.model";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {UIService} from "../shared/ui.service";

@Injectable()
export class TrainingService {
    public exerciseChanged: Subject<FinishedExercise> =
        new Subject<FinishedExercise>();

    public exercisesChanged: Subject<FinishedExercise[] | null> =
        new Subject<FinishedExercise[] | null>();

    /**
     * notify if finished exercises changed
     * @type {Subject<FinishedExercise[]>}
     * @public
     */
    public finishedExercisesChanged: Subject<FinishedExercise[]> =
        new Subject<FinishedExercise[]>();

    private availableExercises: FinishedExercise[] = [];

    private runningExercise: FinishedExercise | undefined;

    constructor(
        private http: HttpClient,
        private uiService: UIService
    ) {
    }

    public getAvailableExercises() {
        console.log("getAvailableExercises");
        return this.http
            .get<FinishedExercise[]>(
                '/api/exercises/'
            )
            .subscribe(
                (exercises: FinishedExercise[]) => {
                    this.uiService.loadingStateNotifier(false);
                    this.availableExercises = exercises;
                    this.exercisesChanged
                        .next(
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
                    this.exercisesChanged
                        .next(
                            null
                        )
                }
            )
    }

    public startExercise(selectedExerciseId: string) {
        this.runningExercise = this.availableExercises.find(
            ex => ex.id === selectedExerciseId
        )
        this.exerciseChanged.next(
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
        this.exerciseChanged.next(undefined)
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
        this.exerciseChanged.next(undefined)
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
                    this.finishedExercisesChanged
                        .next([
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
