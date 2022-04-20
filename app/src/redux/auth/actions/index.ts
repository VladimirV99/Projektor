import { createAction } from "@reduxjs/toolkit";
import { loginResponse, userType } from "../models";

export const logoutCustomer = createAction('logoutCustomer');
export const registerFailed = createAction<any>('registerFailed');

export const setTokensAndUser = createAction<{ accessToken: string | null, refreshToken: string | null, user: userType }>('setTokensAndUser');
export const clearTokensAndUser = createAction('clearTokensAndUser');

export const loginPending = createAction('loginPending');
export const loginFullfiled = createAction<loginResponse>('loginFullfiled');
export const loginError = createAction('loginError')