import urlJoin from 'url-join';
import URL_BASE from '../global';

export const REGISTER_URL = urlJoin(
    URL_BASE,
    '/Authentication/RegisterCustomer'
);

export const LOGIN_URL = urlJoin(URL_BASE, '/Authentication/Login');

export const UPDATE_NAME = urlJoin(URL_BASE, '/Authentication/UpdateName');

export const UPDATE_PASSWPRD = urlJoin(
    URL_BASE,
    '/Authentication/UpdatePassword'
);
