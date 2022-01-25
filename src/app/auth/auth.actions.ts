import {Action} from "@ngrx/store";


export const SET_AUTHENTICATED: string = '[AUTH] Set Authenticated';
export const SET_UNAUTHENTICATED: string = '[AUTH] Set Unauthenticated';

export class SetAuthenticated implements Action {
    readonly type = SET_AUTHENTICATED;
}

export class SetUnauthenticated implements Action {
    readonly type = SET_UNAUTHENTICATED;
}

export type AUTHActions = SetAuthenticated | SetUnauthenticated;
