import { MovieSliceType } from "@redux/reducers/Movie";
import { createSelector } from "@reduxjs/toolkit";
import Movie from "../../../models/Movie";

const getCoreState = (state: any) : MovieSliceType => state.movies as MovieSliceType;

export const getMovies = createSelector(
    [getCoreState],
    (state: MovieSliceType) => state.entities
);

export const getMoviesStatus = createSelector(
    [getCoreState],
    (state: MovieSliceType) => state.status
);


