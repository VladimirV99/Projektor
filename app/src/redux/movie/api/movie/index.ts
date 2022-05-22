import axios from 'axios';
import { MOVIE_DETAILS_URL } from 'constants/api/movies';
import Movie from 'models/Movie';

export const getMovie = (movieId: number) => {
    return axios.get<Movie>(MOVIE_DETAILS_URL(movieId));
};
