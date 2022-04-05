import axios from "axios";
import FilterMoviesRequest from "../../../models/Movie/FilterMoviesRequest";
import Movie from "../../../models/Movie";
import { FILTER_MOVIES_URL } from "../../../constants/api/movies";

export const filterMovies = (filter: FilterMoviesRequest) => axios.get<Movie[]>(FILTER_MOVIES_URL, { params: filter });