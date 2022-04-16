import { createAction, createReducer } from '@reduxjs/toolkit';
import { LoadingStatus } from '../../../constants/common';
import { loginCustomer } from '../modules';
import { AuthenticationReducerType } from './types';

const initialState: AuthenticationReducerType = {
    loadingStatus: LoadingStatus.NotInitialized,
    user: null
}

export const logoutCustomer = createAction('logoutCustomer');

const reducer = createReducer(initialState, (builder) => {

    builder.addCase(loginCustomer.pending, (state) => {
        state.loadingStatus = LoadingStatus.Initializing;
    });
    builder.addCase(loginCustomer.rejected, (state) => {
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