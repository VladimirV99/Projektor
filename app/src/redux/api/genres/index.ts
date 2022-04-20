import axios from 'axios'
import Genre from '../../../models/Genre'
import { GET_GENRES_URL } from '../../../constants/api/movies'

export const getGenres = () => axios.get<Genre[]>(GET_GENRES_URL)
