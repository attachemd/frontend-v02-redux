import {Subject} from "rxjs";
import {Exercise} from "./exercise.model";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";

@Injectable()
export class TrainingService {
    public exerciseChanged: Subject<Exercise> =
        new Subject<Exercise>();

    public exercisesChanged: Subject<Exercise[]> =
        new Subject<Exercise[]>();

    private availableExercises: Exercise[] = [];

    private runningExercise: Exercise | undefined;
    private exercises: Exercise[] = [];

    constructor(
        private http: HttpClient,
    ) {
    }

    public getAvailableExercises() {
        return this.http
            .get<Exercise[]>(
                '/api/exercises/'
            )
            .subscribe((exercises: Exercise[]) => {
                    this.availableExercises = exercises;
                    this.exercisesChanged
                        .next([
                            ...this.availableExercises
                        ])
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
                    calories: (
                        this.runningExercise.duration * progress
                    ) / 100,
                    duration: (
                        this.runningExercise.calories * progress
                    ) / 100,
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
        return this.exercises.slice();
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
        this.http
            .post('/api/fexercises/', payload, httpOptions)
            .subscribe(
                response => console.log(response),
                err => console.log(err)
            );
    }

}
