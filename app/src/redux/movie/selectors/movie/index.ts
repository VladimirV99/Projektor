import { MovieSliceType } from 'redux/movie/reducers/Movie';
import { createSelector } from '@reduxjs/toolkit';
import { featuresReducerName } from 'redux/store';

const getCoreState = (state: any): MovieSliceType =>
    state[featuresReducerName].movie.movie as MovieSliceType;

export const getMovie = createSelector(
    [getCoreState],
    (state: MovieSliceType) => state.entity
);

export const getMovieStatus = createSelector(
    [getCoreState],
    (state: MovieSliceType) => state.status
);
