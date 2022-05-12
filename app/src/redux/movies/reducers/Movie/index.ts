import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Movie from 'models/Movie';
import FilterMoviesRequest from 'models/Movie/FilterMoviesRequest';
import { ApiSuccess } from 'models';
import * as API from 'redux/movies/api';
import { PaginatedMovieList } from 'models/Movie/PaginatedMovieList';

export type MovieSliceType = {
    entities: Movie[];
    count: number;
    status: 'idle' | 'pending' | 'success' | 'error';
};

export const filterMovies = createAsyncThunk(
    'movies/filterMovies',
    async (filter: FilterMoviesRequest) => {
        const { data }: ApiSuccess<PaginatedMovieList> = await API.filterMovies(
            filter
        );
        return data;
    }
);

const moviesSlice = createSlice({
    name: 'movies',
    initialState: {
        entities: [] as Movie[],
        count: 0,
        status: 'idle' as 'idle' | 'pending' | 'success' | 'error',
    } as MovieSliceType,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(filterMovies.pending, (state, action) => {
            state.status = 'pending';
        });
        builder.addCase(filterMovies.fulfilled, (state, action) => {
            state.entities = action.payload.movies;
            state.count = action.payload.count;
            state.status = 'success';
        });
        builder.addCase(filterMovies.rejected, (state, action) => {
            state.status = 'error';
        });
    },
});

export default moviesSlice.reducer;
