import { createAction } from '@reduxjs/toolkit';
import { loginResponse, userType } from '../models';

export const registerPending = createAction('registerPending');
export const registerFailed = createAction<any>('registerFailed');

export const setTokensAndUser = createAction<{
    accessToken: string | null;
    refreshToken: string | null;
    user: userType;
}>('setTokensAndUser');

export const loginPending = createAction('loginPending');
export const loginFullfiled = createAction<loginResponse>('loginFullfiled');
export const loginError = createAction('loginError');

export const logoutCustomer = createAction('logoutCustomer');
