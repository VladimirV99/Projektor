import { createAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Movie from 'models/Movie';
import FilterMoviesRequest from 'models/Movie/FilterMoviesRequest';
import { ApiSuccess } from 'models';
import * as API from 'redux/movies/api';
import { PaginatedMovieList } from 'models/Movie/PaginatedMovieList';

export type MovieSliceType = {
    entities: Movie[];
    count: number;
    status: 'idle' | 'pending' | 'success' | 'error';
    deleteStatus: 'idle' | 'pending' | 'success' | 'error';
    updateStatus: 'idle' | 'pending' | 'success' | 'error';
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

export const deleteMovie = createAsyncThunk(
    'movies/deleteMovie',
    async (id: number) => {
        const { data }: ApiSuccess<void> = await API.deleteMovie(id);
        return data;
    }
);

export const resetDeleteStatus = createAction('movies/resetDeleteStatus');

const moviesSlice = createSlice({
    name: 'movies',
    initialState: {
        entities: [] as Movie[],
        count: 0,
        status: 'idle' as 'idle' | 'pending' | 'success' | 'error',
        deleteStatus: 'idle' as 'idle' | 'pending' | 'success' | 'error',
        updateStatus: 'idle' as 'idle' | 'pending' | 'success' | 'error',
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
        builder.addCase(deleteMovie.pending, (state, action) => {
            state.deleteStatus = 'pending';
        });
        builder.addCase(deleteMovie.fulfilled, (state, action) => {
            state.deleteStatus = 'success';
        });
        builder.addCase(deleteMovie.rejected, (state, action) => {
            state.deleteStatus = 'error';
        });
        builder.addCase(resetDeleteStatus, (state, action) => {
            state.deleteStatus = 'idle';
        });
    },
});

export default moviesSlice.reducer;
