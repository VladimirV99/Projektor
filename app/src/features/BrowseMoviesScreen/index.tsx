import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { filterMovies } from "../../redux/reducers/Movie";
import { Backdrop, CircularProgress, Pagination } from "@mui/material";
import { Col, Row } from "react-bootstrap";
import MovieCard from "../../components/MovieCard"
import MovieFilters from "../../components/MovieFilters";
import Movie from "../../models/Movie";
import FilterMoviesRequest from "../../models/Movie/FilterMoviesRequest";
import * as selectors from '../../redux/selectors';
import * as S from './index.styles';


const BrowseMoviesScreen = () => {

  const [filterMovieRequest, setFilterMovieRequest] = useState<FilterMoviesRequest>(new FilterMoviesRequest());

  const dispatch = useDispatch();
  const movies: Movie[] = useSelector(selectors.getMovies);
  const moviesStatus = useSelector(selectors.getMoviesStatus);
  const moviesCount = useSelector(selectors.getMoviesCount);

  const isMoviesLoading = moviesStatus === 'pending' || moviesStatus === 'idle';

  const numberOfPages = useMemo(() => {
    return Math.ceil(moviesCount / filterMovieRequest.PerPage);
  }, [moviesCount, filterMovieRequest.PerPage]);

  const handlePageChange = (_event: any, page: number) => {
    setFilterMovieRequest(prevState => ({ ...prevState, Page: page }));
  };

  const renderLoading = useCallback(() => {
    return <Backdrop open={true}>
      <CircularProgress />
    </Backdrop>
  }, []);

  const renderPagination = useCallback(() => {
    return <Pagination count={numberOfPages} page={filterMovieRequest.Page} onChange={handlePageChange} />
  }, [numberOfPages, filterMovieRequest.Page]);

  const renderMovies = useCallback(() => {
    return moviesStatus === 'pending' || moviesStatus === 'idle' ? renderLoading()
     : movies.length > 0 ? movies.map(movie => (<S.MovieCardWrapper>
                              <MovieCard key={movie.id} movie={movie} />
                            </S.MovieCardWrapper>))
      : <p>No movies with such filters.</p>;
  }, [movies, moviesStatus, renderLoading]);

  const handleYearRangeChange = (min: number, max: number) => {
    setFilterMovieRequest(prevState => ({ ...prevState, YearFrom: min, YearTo: max }));
  };

  const handleLengthRangeChange = (min: number, max: number) => {
    setFilterMovieRequest(prevState => ({ ...prevState, LengthFrom: min, LengthTo: max }));
  };

  useEffect(() => {
    console.log('Refiltering...');
    dispatch(filterMovies(filterMovieRequest));
  }, [filterMovieRequest, dispatch]);

  if (moviesStatus === 'error') {
    return <div>Error</div>;
  }

  return <S.Container>
    <Row>
      <Col sm={12} md={4}>
        <S.MovieFiltersContainer>
          <MovieFilters onYearRangeChange={handleYearRangeChange} onLengthRangeChange={handleLengthRangeChange}/>
        </S.MovieFiltersContainer>
      </Col>
      <Col sm={12} md={8}>
        {renderPagination()}
        <S.MovieListContainer isLoading={isMoviesLoading} isEmpty={movies.length === 0}>
          {renderMovies()}
        </S.MovieListContainer>
        {renderPagination()}
      </Col>
    </Row>
  </S.Container>
}

export default BrowseMoviesScreen;