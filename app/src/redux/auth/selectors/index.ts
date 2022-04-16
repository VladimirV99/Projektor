import { authenticationReducerName, AuthenticationReducerType } from "../reducers/types";
import { featuresReducerName } from "../types";

export const getState = (state: any) => state[featuresReducerName][authenticationReducerName];

//TODO: Bind onstorage event
export const selectUser = (state: AuthenticationReducerType) => {
    const user = localStorage.getItem('user');

    if(user === null) return null;

    return JSON.parse(user);
}
export const selectIsUserLoggedIn = (state: AuthenticationReducerType) => localStorage.getItem('accessToken') !== null;

export const selectAuthErrors = (state: AuthenticationReducerType) => getState(state).errors;