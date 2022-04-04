import React, { Fragment, useEffect, useState } from "react";
import MovieCard from "../../components/MovieCard";
import Movie from '../../models/Movie';


const BrowseMoviesScreen = () : JSX.Element => {

  const [movies, setMovies ] = useState<Movie[]>([]);

  useEffect(() => {
    setMovies([new Movie(0, "The Matrix", 1999, 120, null, null, null, [], [])])
  }, []);

  return (<Fragment>{movies.map(movie => <MovieCard movie={movie} />)}</Fragment>)
}

export default BrowseMoviesScreen;