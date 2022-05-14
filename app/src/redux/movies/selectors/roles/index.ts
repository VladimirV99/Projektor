import { RolesSliceType } from 'redux/movies/reducers/Roles';
import { createSelector } from '@reduxjs/toolkit';
import { featuresReducerName } from 'redux/store';

const getCoreState = (state: any): RolesSliceType =>
    state[featuresReducerName].movies.roles as RolesSliceType;

export const getRolesStatus = createSelector(
    [getCoreState],
    (state: RolesSliceType) => state.status
);

export const getRoles = createSelector(
    [getCoreState],
    (state: RolesSliceType) => {
        return state.entities;
    }
);
