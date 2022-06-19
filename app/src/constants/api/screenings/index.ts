import urlJoin from 'url-join';
import URL_BASE from '../global';

export const GET_SCREENINGS_FOR_MOVIE_URL = (movieId: number) =>
    urlJoin(URL_BASE, '/Screening/GetScreeningsByMovieId/', movieId.toString());

export const GET_SCREENINGS_FOR_HALL_URL = (hallId: number) =>
    urlJoin(URL_BASE, '/Screening/GetScreeningsByHallId/', hallId.toString());

export const GET_MOVIES_BY_SEARCH_STRING = urlJoin(URL_BASE, '/Movies/FilterMovies');

export const GET_HALLS_BY_SEARCH_STRING = urlJoin(
    URL_BASE,
    `/Screening/GetHallsBySearchString`
);

export const INSERT_SCREENING_URL = urlJoin(
    URL_BASE,
    '/Screening/InsertScreening'
);

export const UPDATE_SCREENING_URL = urlJoin(
    URL_BASE,
    '/Screening/UpdateScreening'
);

export const GET_SCREENINGS_URL = urlJoin(URL_BASE, 'Screening/GetScreenings');

export const DELETE_SCREENING_URL = (deleteScreeningId: number) =>
    urlJoin(URL_BASE, `Screening/DeleteScreeningById/${deleteScreeningId}`);
