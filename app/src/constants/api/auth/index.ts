import urlJoin from 'url-join';
import URL_BASE from '../global';

console.log('joining', URL_BASE, 'and', 'authentication/registercustomer');

export const REGISTER_URL = urlJoin(
    URL_BASE,
    '/Authentication/RegisterCustomer'
);

console.log(REGISTER_URL);

export const LOGIN_URL = urlJoin(URL_BASE, '/Authentication/Login');
