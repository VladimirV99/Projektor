import urlJoin from 'url-join';
import URL_BASE from '../global';

export const FILTER_MOVIES_URL = urlJoin(URL_BASE, '/Movies/FilterMovies');

export const DELETE_MOVIES_URL = (id: number) =>
    urlJoin(URL_BASE, `/Movies/DeleteMovie/${id}`);

export const CREATE_MOVIE_URL = urlJoin(URL_BASE, '/Movies/CreateMovie');
export const UPDATE_MOVIE_URL = urlJoin(URL_BASE, '/Movies/UpdateMovie');

export const GET_GENRES_URL = urlJoin(URL_BASE, '/Movies/GetGenres');

export const GET_FILTER_LIMITS_URL = urlJoin(
    URL_BASE,
    '/Movies/GetFilterLimits'
);

export const SEARCH_PEOPLE_URL = urlJoin(URL_BASE, '/Movies/SearchPeople');

export const GET_ROLES_URL = urlJoin(URL_BASE, '/Movies/GetRoles');
