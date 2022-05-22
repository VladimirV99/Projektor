import { FilterLimitsSliceType } from 'redux/movies/reducers/FilterLimits';
import { createSelector } from '@reduxjs/toolkit';
import { featuresReducerName } from 'redux/store';

const getCoreState = (state: any): FilterLimitsSliceType =>
    state[featuresReducerName].movies.filterLimits as FilterLimitsSliceType;

export const getFilterLimitsStatus = createSelector(
    [getCoreState],
    (state: FilterLimitsSliceType) => state.status
);

export const getLimits = createSelector(
    [getCoreState],
    (state: FilterLimitsSliceType) => {
        return state.limits;
    }
);
