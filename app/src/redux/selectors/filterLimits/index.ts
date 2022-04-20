import { FilterLimitsSliceType } from 'redux/reducers/FilterLimits';
import { createSelector } from '@reduxjs/toolkit';

const getCoreState = (state: any): FilterLimitsSliceType =>
    state.filterLimits as FilterLimitsSliceType;

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
