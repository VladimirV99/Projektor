import { createAction } from '@reduxjs/toolkit';
import { loginResponse, userType } from '../models';

export const registerPending = createAction('registerPending');
export const registerFailed = createAction<any>('registerFailed');
export const registerFulfilled = createAction('registerFulfilled');

export const setTokensAndUser = createAction<{
    accessToken: string | null;
    refreshToken: string | null;
    user: userType;
}>('setTokensAndUser');

export const loginPending = createAction('loginPending');
export const loginFullfiled = createAction<loginResponse>('loginFullfiled');
export const loginError = createAction<any>('loginError');

export const logoutFullfiled = createAction('logoutFullfiled');

export const clearAuthErrors = createAction('clearAuthErrors');

export const updateName = createAction<{ firstName: string; lastName: string }>(
    'updateName'
);

export const openSignUpForm = createAction<boolean>('openSignUpForm');
export const openSignInForm = createAction<boolean>('openSignInForm');
