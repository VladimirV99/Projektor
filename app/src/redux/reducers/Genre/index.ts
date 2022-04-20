import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { ApiSuccess } from '../../../models'
import Genre from '../../../models/Genre'
import * as API from '../../api'

export type GenreSliceType = {
    entities: Genre[]
    status: 'idle' | 'pending' | 'success' | 'error'
}

export const getGenres = createAsyncThunk('genres/get', async () => {
    const { data }: ApiSuccess<Genre[]> = await API.getGenres()
    return data
})

const genresSlice = createSlice({
    name: 'genres',
    initialState: {
        entities: [] as Genre[],
        status: 'idle' as 'idle' | 'pending' | 'success' | 'error',
    } as GenreSliceType,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getGenres.pending, (state, action) => {
            state.status = 'pending'
        })
        builder.addCase(getGenres.fulfilled, (state, action) => {
            state.entities = action.payload
            state.status = 'success'
        })
        builder.addCase(getGenres.rejected, (state, action) => {
            state.status = 'error'
        })
    },
})

export default genresSlice.reducer
