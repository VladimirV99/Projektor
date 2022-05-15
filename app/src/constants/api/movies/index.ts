import urlJoin from 'url-join';
import URL_BASE from '../global';

export const FILTER_MOVIES_URL = urlJoin(URL_BASE, '/Movies/FilterMovies');

export const GET_GENRES_URL = urlJoin(URL_BASE, '/Movies/GetGenres');

export const GET_FILTER_LIMITS_URL = urlJoin(
    URL_BASE,
    '/Movies/GetFilterLimits'
);

export const MOVIE_DETAILS_URL = (movieId: number) =>
    urlJoin(URL_BASE, '/Movies/GetMovieById', movieId.toString());
