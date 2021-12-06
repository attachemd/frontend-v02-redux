import {Subject} from "rxjs";
import {Exercise} from "./exercise.model";

export class TrainingService {
    public exerciseChanged: Subject<Exercise> =
        new Subject<Exercise>();
    private availableExercises: Exercise[] =
        [
            {
                id: 'crunches',
                name: 'Crunches',
                duration: 5,
                calories: 8
            },
            {
                id: 'touch-toes',
                name: 'Touch Toes',
                duration: 180,
                calories: 15
            },
            {
                id: 'side-lunges',
                name: 'Side Lunges',
                duration: 120,
                calories: 18
            },
            {
                id: 'burpees',
                name: 'Burpees',
                duration: 60,
                calories: 8
            }
        ];

    private runningExercise: Exercise | undefined;
    private exercises: Exercise[] = [];

    public getAvailableExercises() {
        return this.availableExercises.slice();
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
