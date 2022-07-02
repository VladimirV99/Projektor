import urlJoin from 'url-join';
import URL_BASE from '../global';

export const GET_USER_RESERVATIONS = urlJoin(
    URL_BASE,
    '/Reservation/GetUserReservations'
);

export const CANCEL_RESERVATION = (id: number) =>
    urlJoin(URL_BASE, `/Reservation/CancelReservation/${id.toString()}`);

export const GET_SEATS_FOR_SCREENING = (screeningId: number) =>
    urlJoin(
        URL_BASE,
        '/Reservation/GetSeatsForScreening/',
        screeningId.toString()
    );

export const CREATE_RESETVATION = urlJoin(
    URL_BASE,
    '/Reservation/CreateReservation'
);

export const GET_HALLS_URL = urlJoin(URL_BASE, '/Hall/GetHalls');

export const CREATE_HALL_URL = urlJoin(URL_BASE, '/Hall/CreateHall');

export const DELETE_HALL_URL = (id: number) =>
    urlJoin(URL_BASE, `/Hall/DeleteHall/${id}`);
