import { GenreSliceType } from 'redux/movies/reducers/Genre';
import { createSelector } from '@reduxjs/toolkit';
import { featuresReducerName } from 'redux/store';

const getCoreState = (state: any): GenreSliceType =>
    state[featuresReducerName].movies.genres as GenreSliceType;

export const getGenresStatus = createSelector(
    [getCoreState],
    (state: GenreSliceType) => state.status
);

export const isGenresAlreadyLoaded = createSelector(
    [getGenresStatus],
    (status: string) => status === 'success'
);

export const getGenres = createSelector(
    [getCoreState],
    (state: GenreSliceType) => {
        console.log('selecting from', state);
        return state.entities;
    }
);
