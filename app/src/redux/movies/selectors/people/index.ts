import { PeopleSliceType } from 'redux/movies/reducers/People';
import { createSelector } from '@reduxjs/toolkit';
import { featuresReducerName } from 'redux/store';

const getCoreState = (state: any): PeopleSliceType =>
    state[featuresReducerName].movies.people as PeopleSliceType;

export const getPeople = createSelector(
    [getCoreState],
    (state: PeopleSliceType) => state.entities
);

export const getPeopleStatus = createSelector(
    [getCoreState],
    (state: PeopleSliceType) => state.status
);

export const getPeopleCount = createSelector(
    [getCoreState],
    (state: PeopleSliceType) => state.count
);

export const getPeopleUpdateStatus = createSelector(
    [getCoreState],
    (state: PeopleSliceType) => state.updateStatus
);

export const getPeopleDeleteStatus = createSelector(
    [getCoreState],
    (state: PeopleSliceType) => state.deleteStatus
);
