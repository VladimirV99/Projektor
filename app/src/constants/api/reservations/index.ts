import urlJoin from 'url-join';
import URL_BASE from '../global';

export const GET_USER_RESERVATIONS_URL = urlJoin(
    URL_BASE,
    '/Reservation/GetUserReservations'
);

export const CANCEL_RESERVATION_URL = (id: number) =>
    urlJoin(URL_BASE, `/Reservation/CancelReservation/${id.toString()}`);

export const GET_SEATS_FOR_SCREENING_URL = (screeningId: number) =>
    urlJoin(
        URL_BASE,
        '/Reservation/GetSeatsForScreening/',
        screeningId.toString()
    );

export const CREATE_RESERVATION_URL = urlJoin(
    URL_BASE,
    '/Reservation/CreateReservation'
);

export const GET_HALLS_URL = urlJoin(URL_BASE, '/Hall/GetHalls');

export const CREATE_HALL_URL = urlJoin(URL_BASE, '/Hall/CreateHall');

export const DELETE_HALL_URL = (id: number) =>
    urlJoin(URL_BASE, `/Hall/DeleteHall/${id}`);
