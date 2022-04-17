import { createAction, createReducer } from '@reduxjs/toolkit';
import { LoadingStatus } from '../../../constants/common';
import { loginCustomer } from '../modules';
import { AuthenticationReducerType } from './types';

const initialState: AuthenticationReducerType = {
    loadingStatus: LoadingStatus.NotInitialized,
    user: null,
    errors: null
}

export const logoutCustomer = createAction('logoutCustomer');
export const registerFailed = createAction<any>('registerFailed');

const reducer = createReducer(initialState, (builder) => {

    builder.addCase(registerFailed, (state, action) => {
        state.errors = action.payload;
    });
    builder.addCase(loginCustomer.pending, (state) => {
        state.loadingStatus = LoadingStatus.Initializing;
    });
    builder.addCase(loginCustomer.rejected, (state, action) => {
        state.loadingStatus = LoadingStatus.Failed;
    });
    builder.addCase(loginCustomer.fulfilled, (state, action) => {
        state.loadingStatus = LoadingStatus.Fetched;
        state.user = action.payload.user;
    });
    builder.addCase(logoutCustomer, (state) => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
    });
});

export default reducer;