import {FinishedExercise} from "./finished-exercise.model";
import * as fromRoot from '../app.reducer'
import {TrainingActions, SET_AVAILABLE_TRAININGS, SET_FINISHED_TRAININGS, START_ACTIVE_TRAINING, STOP_ACTIVE_TRAINING} from "./training.actions";
import {createFeatureSelector} from "@ngrx/store";

export interface TrainingState {
    availableExercises: FinishedExercise[],
    finishedExercises: FinishedExercise[],
    activeTraining: FinishedExercise | null
}

export interface State extends fromRoot.State {
    training: TrainingState
}

const initialState: TrainingState = {
    availableExercises: [],
    finishedExercises: [],
    activeTraining: null
}

export function trainingReducer(state: TrainingState = initialState, action: TrainingActions) {
    switch (action.type) {
        case SET_AVAILABLE_TRAININGS:
            return {
                ...state,
                availableExercises: action.payload
            };
        case SET_FINISHED_TRAININGS:
            return {
                ...state,
                finishedExercises: action.payload
            };
        case START_ACTIVE_TRAINING:
            return {
                ...state,
                activeTraining: action.payload
            };
        case STOP_ACTIVE_TRAINING:
            return {
                ...state,
                activeTraining: null
            };
        default:
            return state;
    }
}

export const getAvailableExercises = (state: TrainingState) => state.availableExercises;
export const getFinishedExercises = (state: TrainingState) => state.finishedExercises;
export const getActiveTraining = (state: TrainingState) => state.activeTraining;
 export const getTrainingState = createFeatureSelector<TrainingState>('training')

