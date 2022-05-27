import { createAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ApiSuccess } from 'models';
import * as API from 'redux/movies/api';
import Person from 'models/Movie/Person';
import PaginatedPeopleList from 'models/Movie/PaginatedPeopleList';
import CreateOrUpdatePersonRequest from 'models/People';

export type PeopleSliceType = {
    entities: Person[];
    count: number;
    status: 'idle' | 'pending' | 'success' | 'error';
    deleteStatus: 'idle' | 'pending' | 'success' | 'error';
    updateStatus: 'idle' | 'pending' | 'success' | 'error';
};

export const searchPeopleAdmin = createAsyncThunk(
    'people/searchPeopleAdmin',
    async ({
        searchString,
        page,
    }: {
        searchString: string;
        page: number;
    }): Promise<PaginatedPeopleList> => {
        const { data }: ApiSuccess<PaginatedPeopleList> =
            await API.searchPeopleAdmin(searchString, page);
        return data;
    }
);

export const deletePerson = createAsyncThunk(
    'people/deletePeople',
    async (id: number) => {
        const { data }: ApiSuccess<void> = await API.deletePerson(id);
        return data;
    }
);

export const resetPeopleDeleteStatus = createAction(
    'people/resetPeopleDeleteStatus'
);

export const createOrUpdatePerson = createAsyncThunk(
    'people/createOrUpdatePerson',
    async (request: CreateOrUpdatePersonRequest) => {
        const { data }: ApiSuccess<Person> = await API.createOrUpdatePerson(
            request
        );
        return data;
    }
);

export const resetPeopleUpdateStatus = createAction(
    'people/resetPeopleUpdateStatus'
);

export const patchPerson = createAction<Person>('people/patchPerson');

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
        builder.addCase(searchPeopleAdmin.fulfilled, (state, action) => {
            state.entities = action.payload.people;
            state.count = action.payload.count;
            state.status = 'success';
        });
        builder.addCase(searchPeopleAdmin.rejected, (state, action) => {
            state.status = 'error';
        });
        builder.addCase(deletePerson.pending, (state, action) => {
            state.deleteStatus = 'pending';
        });
        builder.addCase(deletePerson.fulfilled, (state, action) => {
            state.deleteStatus = 'success';
        });
        builder.addCase(deletePerson.rejected, (state, action) => {
            state.deleteStatus = 'error';
        });
        builder.addCase(resetPeopleDeleteStatus, (state, action) => {
            state.deleteStatus = 'idle';
        });
        builder.addCase(createOrUpdatePerson.pending, (state, action) => {
            state.updateStatus = 'pending';
        });
        builder.addCase(createOrUpdatePerson.fulfilled, (state, action) => {
            state.updateStatus = 'success';
        });
        builder.addCase(createOrUpdatePerson.rejected, (state, action) => {
            state.updateStatus = 'error';
        });
        builder.addCase(resetPeopleUpdateStatus, (state, action) => {
            state.updateStatus = 'idle';
        });
        builder.addCase(patchPerson, (state, action) => {
            const index = state.entities.findIndex(
                (person) => person.id === action.payload.id
            );
            if (index !== -1) {
                state.entities[index] = action.payload;
            }
        });
    },
});

export default peopleSlice.reducer;
