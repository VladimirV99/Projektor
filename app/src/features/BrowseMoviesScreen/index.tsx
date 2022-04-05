import React, { Fragment, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import MovieCard from "@components/MovieCard";
import Movie from "@models/Movie";
import { filterMovies } from "../../redux/reducers/Movie";
import FilterMoviesRequest from "../../models/Movie/FilterMoviesRequest";

const BrowseMoviesScreen = () : JSX.Element => {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(filterMovies(new FilterMoviesRequest()));
  }, []);

  return <h1>test</h1>;
}

export default BrowseMoviesScreen;