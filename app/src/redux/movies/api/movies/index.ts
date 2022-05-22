import axios from 'axios';
import FilterMoviesRequest from 'models/Movie/FilterMoviesRequest';
import {
    FILTER_MOVIES_URL,
    DELETE_MOVIES_URL,
    CREATE_MOVIE_URL,
    UPDATE_MOVIE_URL,
} from 'constants/api/movies';
import { PaginatedMovieList } from 'models/Movie/PaginatedMovieList';
import Movie from 'models/Movie';
import CreateOrUpdateMovieRequest from 'models/Movie/CreateOrUpdateMovieRequest';
import axiosAuthInstance from 'axios/instance';

export const filterMovies = (filter: FilterMoviesRequest) => {
    return axios.get<PaginatedMovieList>(FILTER_MOVIES_URL, { params: filter });
};

export const deleteMovie = (id: number) => {
    return axiosAuthInstance.delete(DELETE_MOVIES_URL(id));
};

export const createOrUpdateMovie = (request: CreateOrUpdateMovieRequest) => {
    if (request.id !== -1) {
        return axiosAuthInstance.put(UPDATE_MOVIE_URL, request);
    } else {
        return axiosAuthInstance.post(CREATE_MOVIE_URL, request);
    }
};
