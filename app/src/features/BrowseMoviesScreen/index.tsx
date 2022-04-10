import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { filterMovies } from "../../redux/reducers/Movie";
import MovieCard from "../../components/MovieCard"
import Movie from "../../models/Movie";
import FilterMoviesRequest from "../../models/Movie/FilterMoviesRequest";
import * as selectors from '../../redux/selectors';
import * as S from './index.styles';
import { Backdrop, CircularProgress, Pagination } from "@mui/material";

const BrowseMoviesScreen = () => {

  const [filterMovieRequest, setFilterMovieRequest] = useState<FilterMoviesRequest>(new FilterMoviesRequest());

  const dispatch = useDispatch();
  const movies: Movie[] = useSelector(selectors.getMovies);
  const moviesStatus = useSelector(selectors.getMoviesStatus);

  const movieCount = useMemo(() => movies.length, [movies]);
  const pageCount = useMemo(() => Math.ceil(movieCount / filterMovieRequest.PerPage), [movieCount, filterMovieRequest.PerPage]);

  const handlePageChange = (event: any, page: number) => {
    setFilterMovieRequest(prevState => ({ ...prevState, Page: page }));
  };

  const renderLoading = useCallback(() => {
    return <Backdrop open={true}>
      <CircularProgress />
    </Backdrop>
  }, []);

  useEffect(() => {
    dispatch(filterMovies(filterMovieRequest));
  }, [filterMovieRequest]);

  if (moviesStatus === 'error') {
    return <div>Error</div>;
  }

  return <S.Container>
    <S.MovieFiltersContainer>
      Filters here.
    </S.MovieFiltersContainer>
    <S.MovieListContainer>
      <Pagination count={movieCount} page={filterMovieRequest.Page} onChange={handlePageChange} />
      {moviesStatus === 'pending' || moviesStatus === 'idle' ? renderLoading() : movies.map(movie => (<S.MovieCardWrapper><MovieCard key={movie.id} movie={movie} /></S.MovieCardWrapper>))}
    </S.MovieListContainer>
  </S.Container>
}

export default BrowseMoviesScreen;