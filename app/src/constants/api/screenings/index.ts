import urlJoin from 'url-join';
import URL_BASE from '../global';

export const GET_SCREENINGS_FOR_MOVIE_URL = (movieId: number) =>
    urlJoin(URL_BASE, '/Screening/GetScreeningsByMovieId/', movieId.toString());

export const GET_SCREENINGS_FOR_HALL_URL = (hallId: number) =>
    urlJoin(URL_BASE, '/Screening/GetScreeningsByHallId/', hallId.toString());
