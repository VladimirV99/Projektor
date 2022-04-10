import React, { Fragment, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { filterMovies } from "../../redux/reducers/Movie";
import MovieCard from "../../components/MovieCard"
import Movie from "../../models/Movie";
import FilterMoviesRequest from "../../models/Movie/FilterMoviesRequest";
import * as selectors from '../../redux/selectors';
import * as S from './index.styles';

const BrowseMoviesScreen = () => {

  const [filterMovieRequest, setFilterMovieRequest] = useState<FilterMoviesRequest>(new FilterMoviesRequest());

  const dispatch = useDispatch();
  const movies: Movie[] = useSelector(selectors.getMovies);
  const moviesStatus = useSelector(selectors.getMoviesStatus);

  useEffect(() => {
    dispatch(filterMovies(filterMovieRequest));
  }, [filterMovieRequest]);

  if (moviesStatus === 'pending' || moviesStatus === 'idle') {
    return <div>Loading...</div>;
  }

  if (moviesStatus === 'error') {
    return <div>Error</div>;
  }

  return <S.Container>
    {movies.map(movie => (<S.MovieCardWrapper><MovieCard key={movie.id} movie={movie} /></S.MovieCardWrapper>))}
  </S.Container>
}

export default BrowseMoviesScreen;