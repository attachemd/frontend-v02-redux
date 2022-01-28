import {FinishedExercise} from "../finished-exercise.model";
import * as fromRoot from '../../state/app.reducer'
import {
    TrainingActions,
    SET_AVAILABLE_TRAININGS,
    SET_FINISHED_TRAININGS,
    START_ACTIVE_TRAINING,
    STOP_ACTIVE_TRAINING
} from "./training.actions";
import {createFeatureSelector, createSelector} from "@ngrx/store";

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

export function trainingReducer(state = initialState, action: TrainingActions): TrainingState {
    switch (action.type) {
        case SET_AVAILABLE_TRAININGS:
            return {
                ...state,
                availableExercises: action.payload as FinishedExercise[]
            };
        case SET_FINISHED_TRAININGS:
            return {
                ...state,
                finishedExercises: action.payload as FinishedExercise[]
            };
        case START_ACTIVE_TRAINING:
            return {
                ...state,
                activeTraining: {
                    ...state.availableExercises.find(
                        ex => ex.id === action.payload
                    )
                } as FinishedExercise | null
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

export const getTrainingState = createFeatureSelector<TrainingState>('training');

export const getAvailableExercises = createSelector(getTrainingState, (state: TrainingState) => state.availableExercises);
export const getFinishedExercises = createSelector(getTrainingState, (state: TrainingState) => state.finishedExercises);
export const getActiveTraining = createSelector(getTrainingState, (state: TrainingState) => state.activeTraining);
export const getIsTraining = createSelector(getTrainingState, (state: TrainingState) => state.activeTraining !== null);


