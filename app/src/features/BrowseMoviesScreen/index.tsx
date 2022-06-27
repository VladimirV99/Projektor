import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { filterMovies } from 'redux/movies/reducers/Movie';
import { getGenres } from 'redux/movies/reducers/Genre';
import { getFilterLimits } from 'redux/movies/reducers/FilterLimits';
import { Backdrop, CircularProgress, Pagination } from '@mui/material';
import { Col, Row } from 'react-bootstrap';
import MovieCard from 'components/MovieCard';
import MovieFilters from 'components/MovieFilters';
import Movie from 'models/Movie';
import FilterMoviesRequest from 'models/Movie/FilterMoviesRequest';
import useAsyncError from 'hooks/useAsyncError';
import * as selectors from 'redux/movies/selectors';
import * as S from './index.styles';

const BrowseMoviesScreen = (): JSX.Element => {
    const [filterMovieRequest, setFilterMovieRequest] =
        useState<FilterMoviesRequest>(new FilterMoviesRequest());

    const throwAsyncError = useAsyncError();
    const dispatch = useDispatch();
    const movies: Movie[] = useSelector(selectors.getMovies);
    const moviesStatus = useSelector(selectors.getMoviesStatus);
    const moviesCount = useSelector(selectors.getMoviesCount);

    const genres = useSelector(selectors.getGenres);
    const genresStatus = useSelector(selectors.getGenresStatus);
    const filterLimitsStatus = useSelector(selectors.getFilterLimitsStatus);

    const filterLimits = useSelector(selectors.getLimits);

    const isMoviesLoading =
        moviesStatus === 'pending' || moviesStatus === 'idle';
    const isGenresLoading =
        genresStatus === 'pending' || genresStatus === 'idle';

    const numberOfPages = useMemo(() => {
        return Math.ceil(moviesCount / filterMovieRequest.PerPage);
    }, [moviesCount, filterMovieRequest.PerPage]);

    const handlePageChange = (_event: any, page: number) => {
        setFilterMovieRequest((prevState) => ({ ...prevState, Page: page }));
    };

    const renderLoading = useCallback(() => {
        return (
            <Backdrop open={true}>
                <CircularProgress />
            </Backdrop>
        );
    }, []);

    const renderPagination = useCallback(() => {
        return (
            <Pagination
                count={numberOfPages}
                page={filterMovieRequest.Page}
                onChange={handlePageChange}
            />
        );
    }, [numberOfPages, filterMovieRequest.Page]);

    const renderMovies = useCallback(() => {
        return isMoviesLoading || isGenresLoading ? (
            renderLoading()
        ) : movies.length > 0 ? (
            movies.map((movie) => (
                <S.MovieCardWrapper key={movie.id}>
                    <MovieCard movie={movie} onClick={() => {}} />
                </S.MovieCardWrapper>
            ))
        ) : (
            <p>No movies with such filters.</p>
        );
    }, [movies, renderLoading, isMoviesLoading, isGenresLoading]);

    const handleYearRangeChange = (min: number, max: number) => {
        setFilterMovieRequest((prevState) => ({
            ...prevState,
            YearFrom: min,
            YearTo: max,
            Page: 1,
        }));
    };

    const handleLengthRangeChange = (min: number, max: number) => {
        setFilterMovieRequest((prevState) => ({
            ...prevState,
            LengthFrom: min,
            LengthTo: max,
            Page: 1,
        }));
    };

    const handleGenreIdsChange = (genreIds: number[] | null) => {
        setFilterMovieRequest((prevState) => ({
            ...prevState,
            Genres: genreIds,
            Page: 1,
        }));
    };

    const handleSearchTermChange = (searchTerm: string) => {
        setFilterMovieRequest((prevState) => ({
            ...prevState,
            searchString: searchTerm,
            Page: 1,
        }));
    };

    useEffect(() => {
        dispatch(filterMovies(filterMovieRequest));
    }, [filterMovieRequest, dispatch]);

    useEffect(() => {
        if (genresStatus !== 'idle') {
            return;
        }
        dispatch(getGenres());
    }, [dispatch, genresStatus]);

    useEffect(() => {
        if (filterLimitsStatus !== 'idle') {
            return;
        }
        dispatch(getFilterLimits());
    }, [dispatch, filterLimitsStatus]);

    useEffect(() => {
        if (moviesStatus === 'error' || genresStatus === 'error') {
            throwAsyncError(new Error('Something went wrong'));
        }
    }, [moviesStatus, genresStatus, throwAsyncError]);

    return (
        <S.Container>
            <Row>
                <Col sm={12} md={4}>
                    <S.MovieFiltersContainer>
                        <MovieFilters
                            genres={genres}
                            filterLimits={filterLimits}
                            onYearRangeChange={handleYearRangeChange}
                            onLengthRangeChange={handleLengthRangeChange}
                            onGenreIdsChange={handleGenreIdsChange}
                            onSearchTermChange={handleSearchTermChange}
                        />
                    </S.MovieFiltersContainer>
                </Col>
                <Col sm={12} md={8}>
                    {renderPagination()}
                    <S.MovieListContainer
                        isLoading={isMoviesLoading || isGenresLoading}
                        isEmpty={movies.length === 0}
                    >
                        {renderMovies()}
                    </S.MovieListContainer>
                    {renderPagination()}
                </Col>
            </Row>
        </S.Container>
    );
};

export default BrowseMoviesScreen;
