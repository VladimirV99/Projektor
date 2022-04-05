import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Movie from "../../../models/Movie";
import FilterMoviesRequest from "../../../models/Movie/FilterMoviesRequest";
import { ApiSuccess } from "../../../models";
import * as API from "../../api";

export type MovieSliceType = {
    entities: Movie[];
    status: "idle" | "pending" | "success" | "error";
};

export const filterMovies = createAsyncThunk(
    "movies/filterMovies",
    async (filter: FilterMoviesRequest) => {
        const { data: movies }: ApiSuccess<Movie[]> = await API.filterMovies(filter);
        return movies;
    }
);

const moviesSlice = createSlice({
    name: "movies",
    initialState: {
        entities: [] as Movie[],
        status: "idle" as "idle" | "pending" | "success" | "error",
    } as MovieSliceType,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(filterMovies.pending, (state, action) => {
            state.status = "pending";
        });
        builder.addCase(filterMovies.fulfilled, (state, action) => {
            state.entities = action.payload;
            state.status = "success";
        });
        builder.addCase(filterMovies.rejected, (state, action) => {
            state.status = "error";
        });
    }
});
    
export default moviesSlice.reducer;