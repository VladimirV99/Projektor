import { createReducer } from '@reduxjs/toolkit';
import { LoadingStatus } from 'constants/common';
import {
    loginError,
    loginFullfiled,
    loginPending,
    logoutCustomer,
    registerFailed,
    registerPending,
    setTokensAndUser,
    updateName,
} from '../actions';
import { AuthenticationReducerType } from './types';

const initialState: AuthenticationReducerType = {
    loadingStatus: LoadingStatus.NotInitialized,
    user: null,
    accessToken: null,
    refreshToken: null,
    errors: null,
};

const reducer = createReducer(initialState, (builder) => {
    builder.addCase(registerPending, (state) => {
        state.loadingStatus = LoadingStatus.Initializing;
    });
    builder.addCase(registerFailed, (state, action) => {
        state.errors = action.payload;
    });
    builder.addCase(loginPending, (state) => {
        state.loadingStatus = LoadingStatus.Initializing;
    });
    builder.addCase(loginError, (state) => {
        state.loadingStatus = LoadingStatus.Failed;
    });
    builder.addCase(loginFullfiled, (state, action) => {
        state.loadingStatus = LoadingStatus.Fetched;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
    });
    builder.addCase(logoutCustomer, (state) => {
        state.accessToken = null;
        state.refreshToken = null;
        state.user = null;
    });
    builder.addCase(setTokensAndUser, (state, action) => {
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.user = action.payload.user;
    });
    builder.addCase(updateName, (state, action) => {
        if (!state.user) {
            return;
        }
        state.user.firstName = action.payload.firstName;
        state.user.lastName = action.payload.lastName;
    });
});

export default reducer;
