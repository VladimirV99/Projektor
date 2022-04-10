import axios from "axios";
import FilterMoviesRequest from "../../../models/Movie/FilterMoviesRequest";
import Movie from "../../../models/Movie";
import { FILTER_MOVIES_URL } from "../../../constants/api/movies";
import { PaginatedMovieList } from "@models/Movie/PaginatedMovieList";

export const filterMovies = (filter: FilterMoviesRequest) => axios.get<PaginatedMovieList>(FILTER_MOVIES_URL, { params: filter });