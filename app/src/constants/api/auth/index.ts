import urlJoin from 'url-join';
import URL_BASE from '../global';

export const REGISTER_URL = urlJoin(
    URL_BASE,
    '/Authentication/RegisterCustomer'
);

export const LOGIN_URL = urlJoin(URL_BASE, '/Authentication/Login');

export const UPDATE_NAME = urlJoin(URL_BASE, '/User/UpdateName');

export const UPDATE_PASSWORD = urlJoin(URL_BASE, '/User/UpdatePassword');

export const LOGOUT_URL = urlJoin(URL_BASE, 'Authentication/Logout');
