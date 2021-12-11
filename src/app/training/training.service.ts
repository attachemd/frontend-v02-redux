import {Subject} from "rxjs";
import {Exercise} from "./exercise.model";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {UIService} from "../shared/ui.service";

@Injectable()
export class TrainingService {
    public exerciseChanged: Subject<Exercise> =
        new Subject<Exercise>();

    public exercisesChanged: Subject<Exercise[] | null> =
        new Subject<Exercise[] | null>();

    /**
     * notify if finished exercises changed
     * @type {Subject<Exercise[]>}
     * @public
     */
    public finishedExercisesChanged: Subject<Exercise[]> =
        new Subject<Exercise[]>();

    private availableExercises: Exercise[] = [];

    private runningExercise: Exercise | undefined;

    constructor(
        private http: HttpClient,
        private uiService: UIService
    ) {
    }

    public getAvailableExercises() {
        console.log("getAvailableExercises");
        return this.http
            .get<Exercise[]>(
                '/api/exercises/'
            )
            .subscribe(
                (exercises: Exercise[]) => {
                    this.uiService.loadingStateChange.next(false);
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
                    this.uiService.loadingStateChange.next(false);
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
            .get<Exercise[]>(
                '/api/fexercises/'
            )
            .subscribe(
                (exercises: Exercise[]) => {
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

    private addDataToDatabase(exercise: Exercise) {
        let {id, date, ...payload} = exercise;
        // let str_payload = JSON.stringify(payload)
        let str_payload = {
            calories: 11,
            duration: 7,
            name: "Chapman-Bell",
            state: "completed"
        }
        console.log("str_payload: ")
        console.log(str_payload)
        const httpOptions = {
            headers: new HttpHeaders(
                {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + btoa(
                        'me:1234'
                    )
                }
            )
        };
        console.log("payload: ");
        console.log(payload);
        this.http
            .post('/api/fexercises/', payload)
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
