import { createReducer } from '@reduxjs/toolkit';
import { LoadingStatus } from '../../../constants/common';
import { clearTokensAndUser, loginError, loginFullfiled, loginPending, logoutCustomer, registerFailed, setTokensAndUser } from '../actions';
import { AuthenticationReducerType } from './types';

const initialState: AuthenticationReducerType = {
    loadingStatus: LoadingStatus.NotInitialized,
    user: null,
    accessToken: null,
    refreshToken: null,
    errors: null
}

const reducer = createReducer(initialState, (builder) => {

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
    builder.addCase(clearTokensAndUser, (state) => {
        state.accessToken = null;
        state.refreshToken = null;
        state.user = null;
    });
});

export default reducer;