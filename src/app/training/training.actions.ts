import {Action} from "@ngrx/store";
import {FinishedExercise} from "./finished-exercise.model";


export const SET_AVAILABLE_TRAININGS: string = '[TRAINING] Set Available Trainings';
export const SET_FINISHED_TRAININGS: string = '[TRAINING] Set Finished Trainings';
export const START_ACTIVE_TRAINING: string = '[TRAINING] Start Active Training';
export const STOP_ACTIVE_TRAINING: string = '[TRAINING] Stop Active Training';

export class SetAvailableTrainings implements Action {
    readonly type = SET_AVAILABLE_TRAININGS;

    constructor(public payload: FinishedExercise[]) {
    }
}

export class SetFinishedTrainings implements Action {
    readonly type = SET_FINISHED_TRAININGS;

    constructor(public payload: FinishedExercise[]) {
    }
}

export class StartActiveTraining implements Action {
    readonly type = START_ACTIVE_TRAINING;

    constructor(public payload: String) {
    }
}

export class StopActiveTraining implements Action {
    readonly type = STOP_ACTIVE_TRAINING;

    constructor(public payload: null) {
    }
}

export type TrainingActions = SetAvailableTrainings | SetFinishedTrainings | StartActiveTraining | StopActiveTraining;
