import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ApiSuccess } from '../../../models';
import FilterLimits from '../../../models/FilterLimits';
import * as API from '../../api';

export type FilterLimitsSliceType = {
    limits: FilterLimits;
    status: 'idle' | 'pending' | 'success' | 'error';
};

export const getFilterLimits = createAsyncThunk(
    'filterLimits/get',
    async () => {
        const { data }: ApiSuccess<FilterLimits> = await API.getFilterLimits();
        return data;
    }
);

const filterLimitsSlice = createSlice({
    name: 'filterLimits',
    initialState: {
        limits: new FilterLimits(1900, new Date().getFullYear(), 10, 500),
        status: 'idle' as 'idle' | 'pending' | 'success' | 'error',
    } as FilterLimitsSliceType,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getFilterLimits.pending, (state, action) => {
            state.status = 'pending';
        });
        builder.addCase(getFilterLimits.fulfilled, (state, action) => {
            state.limits = action.payload;
            state.status = 'success';
        });
        builder.addCase(getFilterLimits.rejected, (state, action) => {
            state.status = 'error';
        });
    },
});

export default filterLimitsSlice.reducer;
