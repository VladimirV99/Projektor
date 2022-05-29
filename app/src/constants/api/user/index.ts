import urlJoin from 'url-join';
import URL_BASE from '../global';

export const GET_ALL_USERS_URL =
    urlJoin(URL_BASE, '/Administrator/GetAllUsers');

export const DELETE_USER_BY_EMAIL_URL = (email: string) =>
    urlJoin(URL_BASE, `Administrator/DeleteUserByEmail/${email}`);

export const REVOKE_TOKENS_URL = 
    urlJoin(URL_BASE, 'Administrator/RevokeAllTokens');

export const INSERT_ADMIN = 
    urlJoin(URL_BASE, 'Administrator/RegisterAdministrator');