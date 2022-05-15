import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Movie from 'models/Movie';
import { ApiSuccess } from 'models';
import * as API from 'redux/movie/api';

export type MovieSliceType = {
    entity: Movie | null;
    status: 'idle' | 'pending' | 'success' | 'error';
};

export const getMovie = createAsyncThunk(
    'movie/getMovie',
    async (id: number) => {
        const { data }: ApiSuccess<Movie> = await API.getMovie(id);
        return data;
    }
);

const movieSlice = createSlice({
    name: 'movie',
    initialState: {
        entity: null,
        status: 'idle' as 'idle' | 'pending' | 'success' | 'error',
    } as MovieSliceType,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getMovie.pending, (state, action) => {
            state.status = 'pending';
        });
        builder.addCase(getMovie.fulfilled, (state, action) => {
            state.entity = action.payload;
            state.status = 'success';
        });
        builder.addCase(getMovie.rejected, (state, action) => {
            state.status = 'error';
        });
    },
});

export default movieSlice.reducer;
