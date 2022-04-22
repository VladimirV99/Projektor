import axios from 'axios';
import FilterLimits from 'models/FilterLimits';
import { GET_FILTER_LIMITS_URL } from 'constants/api/movies';

export const getFilterLimits = () =>
    axios.get<FilterLimits>(GET_FILTER_LIMITS_URL);
