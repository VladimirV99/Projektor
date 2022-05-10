import axios from 'axios';
import FilterMoviesRequest from 'models/Movie/FilterMoviesRequest';
import { FILTER_MOVIES_URL } from 'constants/api/movies';
import { PaginatedMovieList } from 'models/Movie/PaginatedMovieList';

export const filterMovies = (filter: FilterMoviesRequest) => {
    return axios.get<PaginatedMovieList>(FILTER_MOVIES_URL, { params: filter });
};
