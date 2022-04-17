import { createSelector } from "@reduxjs/toolkit";
import { RootStateOrAny } from "react-redux";
import { authenticationReducerName, AuthenticationReducerType } from "../reducers/types";
import { featuresReducerName } from "../types";

export const getState = (state: RootStateOrAny) => state[featuresReducerName][authenticationReducerName];

//TODO: Bind onstorage event
export const selectUser = (state: AuthenticationReducerType) => {
    const user = localStorage.getItem('user');

    if(user === null) return null;

    return JSON.parse(user);
}
export const selectIsUserLoggedIn = (state: AuthenticationReducerType) => localStorage.getItem('accessToken') !== null;

export const selectAuthErrors = createSelector([getState], (state) => state.errors);