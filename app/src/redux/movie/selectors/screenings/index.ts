import { ScreeningsSliceType } from 'redux/movie/reducers/Screenings';
import { createSelector } from '@reduxjs/toolkit';
import { featuresReducerName } from 'redux/store';

const getCoreState = (state: any): ScreeningsSliceType =>
    state[featuresReducerName].movie.screenings as ScreeningsSliceType;

export const getScreeningsForMovie = createSelector(
    [getCoreState],
    (state: ScreeningsSliceType) => state.entities
);

export const getScreeningsForMovieStatus = createSelector(
    [getCoreState],
    (state: ScreeningsSliceType) => state.status
);
