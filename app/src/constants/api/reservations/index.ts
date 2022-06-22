import urlJoin from 'url-join';
import URL_BASE from '../global';

export const GET_SEATS_FOR_SCREENING = (screeningId: number) =>
    urlJoin(URL_BASE, '/Reservation/GetSeatsForScreening/', screeningId.toString());

export const CREATE_RESETVATION = urlJoin(URL_BASE, '/Reservation/CreateReservation');