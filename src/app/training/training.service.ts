import {Subject} from "rxjs";
import {Exercise} from "./exercise.model";
import {HttpClient} from "@angular/common/http";
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
        this.exercises.push(
            {
                calories: 0,
                duration: 0,
                id: "",
                name: "",
                ...this.runningExercise,
                date: new Date(),
                state: "completed"
            }
        );
        this.runningExercise = undefined;
        this.exerciseChanged.next(undefined)
    }

    public cancelExercise(progress: number) {
        if (this.runningExercise) {
            this.exercises.push(
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

}
