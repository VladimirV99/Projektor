import { MovieSliceType } from 'redux/movies/reducers/Movie';
import { createSelector } from '@reduxjs/toolkit';
import { featuresReducerName } from 'redux/store';

const getCoreState = (state: any): MovieSliceType =>
    state[featuresReducerName].movies.movies as MovieSliceType;

export const getMovies = createSelector(
    [getCoreState],
    (state: MovieSliceType) => state.entities
);

export const getMoviesStatus = createSelector(
    [getCoreState],
    (state: MovieSliceType) => state.status
);

export const getMoviesCount = createSelector(
    [getCoreState],
    (state: MovieSliceType) => state.count
);
