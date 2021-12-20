import {AuthData} from "../auth/auth-data.model";

export const validUser: AuthData = {
    email: 'test@example.com',
    password: '123456'
};

export const blankUser: AuthData = {
    email: '',
    password: ''
};
