import { createAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Movie from 'models/Movie';
import FilterMoviesRequest from 'models/Movie/FilterMoviesRequest';
import { ApiSuccess } from 'models';
import * as API from 'redux/movies/api';
import { PaginatedMovieList } from 'models/Movie/PaginatedMovieList';
import CreateOrUpdateMovieRequest from 'models/Movie/CreateOrUpdateMovieRequest';
import { isNull } from 'util';

export type MovieSliceType = {
    entities: Movie[];
    count: number;
    status: 'idle' | 'pending' | 'success' | 'error';
    deleteStatus: 'idle' | 'pending' | 'success' | 'error';
    updateStatus: 'idle' | 'pending' | 'success' | 'error';
    updateError: string | null;
};

export const filterMovies = createAsyncThunk(
    'movies/filterMovies',
    async (filter: FilterMoviesRequest): Promise<PaginatedMovieList> => {
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

export const createOrUpdateMovie = createAsyncThunk(
    'movies/createOrUpdateMovie',
    async (request: CreateOrUpdateMovieRequest) => {
        try {
            const { data }: ApiSuccess<Movie> = await API.createOrUpdateMovie(
                request
            );
            return data;
        } catch (e: any) {
            if (e.response && e.response.data && e.response.data.errors) {
                throw new Error(
                    Object.entries(e.response.data.errors)
                        .map(([_, v]) => v)
                        .join(',')
                );
            }
            throw new Error('Something went wrong. Please try again later.');
        }
    }
);

export const resetUpdateStatus = createAction('movies/resetUpdateStatus');

export const patchMovie = createAction<Movie>('movies/patchMovie');

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
        builder.addCase(createOrUpdateMovie.pending, (state, action) => {
            state.updateStatus = 'pending';
        });
        builder.addCase(createOrUpdateMovie.fulfilled, (state, action) => {
            state.updateStatus = 'success';
        });
        builder.addCase(createOrUpdateMovie.rejected, (state, action) => {
            state.updateError = action.error.message ?? null;
            state.updateStatus = 'error';
        });
        builder.addCase(resetUpdateStatus, (state, action) => {
            state.updateStatus = 'idle';
        });
        builder.addCase(patchMovie, (state, action) => {
            const index = state.entities.findIndex(
                (movie) => movie.id === action.payload.id
            );
            if (index !== -1) {
                state.entities[index] = action.payload;
            }
        });
    },
});

export default moviesSlice.reducer;
