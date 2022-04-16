import { AuthenticationReducerType } from "../reducers/types";

//TODO: Bind onstorage event
export const selectUser = (state: AuthenticationReducerType) => {
    const user = localStorage.getItem('user');

    if(user === null) return null;

    return JSON.parse(user);
}
export const selectIsUserLoggedIn = (state: AuthenticationReducerType) => localStorage.getItem('accessToken') !== null;