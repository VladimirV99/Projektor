import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Screening from 'models/Screening';
import { ApiSuccess } from 'models';
import * as API from 'redux/movie/api';

export type ScreeningsSliceType = {
    entities: Screening[];
    status: 'idle' | 'pending' | 'success' | 'error';
};

export const getScreeningsForMovie = createAsyncThunk(
    'movie/getScreeningsForMovie',
    async (id: number) => {
        const { data }: ApiSuccess<Screening[]> =
            await API.getScreeningsForMovie(id);
        return data;
    }
);

const screeningsSlice = createSlice({
    name: 'screenings',
    initialState: {
        entities: [],
        status: 'idle' as 'idle' | 'pending' | 'success' | 'error',
    } as ScreeningsSliceType,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getScreeningsForMovie.pending, (state, action) => {
            state.status = 'pending';
        });
        builder.addCase(getScreeningsForMovie.fulfilled, (state, action) => {
            state.entities = action.payload.map((s) => {
                return { ...s, movieStart: new Date(s.movieStart) };
            });
            state.status = 'success';
        });
        builder.addCase(getScreeningsForMovie.rejected, (state, action) => {
            state.status = 'error';
        });
    },
});

export default screeningsSlice.reducer;
