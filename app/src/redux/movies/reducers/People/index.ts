import { createAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ApiSuccess } from 'models';
import * as API from 'redux/movies/api';
import Person from 'models/Movie/Person';
import PaginatedPeopleList from 'models/Movie/PaginatedPeopleList';

export type PeopleSliceType = {
    entities: Person[];
    count: number;
    status: 'idle' | 'pending' | 'success' | 'error';
    deleteStatus: 'idle' | 'pending' | 'success' | 'error';
    updateStatus: 'idle' | 'pending' | 'success' | 'error';
};

export const searchPeopleAdmin = createAsyncThunk(
    'people/searchPeopleAdmin',
    async (
        searchString: string,
        page: number
    ): Promise<PaginatedPeopleList> => {
        const { data }: ApiSuccess<PaginatedPeopleList> =
            await API.searchPeopleAdmin(searchString, page);
        return data;
    }
);

const peopleSlice = createSlice({
    name: 'people',
    initialState: {
        entities: [] as Person[],
        count: 0,
        status: 'idle' as 'idle' | 'pending' | 'success' | 'error',
        deleteStatus: 'idle' as 'idle' | 'pending' | 'success' | 'error',
        updateStatus: 'idle' as 'idle' | 'pending' | 'success' | 'error',
    } as PeopleSliceType,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(searchPeopleAdmin.pending, (state, action) => {
            state.status = 'pending';
        });
    },
});

export default peopleSlice.reducer;
