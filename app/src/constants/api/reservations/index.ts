import urlJoin from 'url-join';
import URL_BASE from '../global';

export const GET_USER_RESERVATIONS = urlJoin(
    URL_BASE,
    '/Reservation/GetUserReservations'
);

export const CANCEL_RESERVATION = (id: number) =>
    urlJoin(URL_BASE, `/Reservation/CancelReservation/${id.toString()}`);
