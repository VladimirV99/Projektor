import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ApiSuccess } from 'models';
import Role from 'models/Role';
import * as API from 'redux/movies/api';

export type RolesSliceType = {
    entities: Role[];
    status: 'idle' | 'pending' | 'success' | 'error';
};

export const getRoles = createAsyncThunk('roles/get', async () => {
    const { data }: ApiSuccess<Role[]> = await API.getRoles();
    return data;
});

const rolesSlice = createSlice({
    name: 'roles',
    initialState: {
        entities: [] as Role[],
        status: 'idle' as 'idle' | 'pending' | 'success' | 'error',
    } as RolesSliceType,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getRoles.pending, (state, action) => {
            state.status = 'pending';
        });
        builder.addCase(getRoles.fulfilled, (state, action) => {
            state.entities = action.payload;
            state.status = 'success';
        });
        builder.addCase(getRoles.rejected, (state, action) => {
            state.status = 'error';
        });
    },
});

export default rolesSlice.reducer;
