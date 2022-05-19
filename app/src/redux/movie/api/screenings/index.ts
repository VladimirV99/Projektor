import axios from 'axios';
import { GET_SCREENINGS_FOR_MOVIE_URL } from 'constants/api/screenings';
import Screening from 'models/Screening';

export const getScreeningsForMovie = (movieId: number) => {
    return axios.get<Screening[]>(GET_SCREENINGS_FOR_MOVIE_URL(movieId));
};
