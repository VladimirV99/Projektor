import { Fragment, useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import FilterMoviesRequest from 'models/Movie/FilterMoviesRequest';
import { filterMovies } from 'redux/movies/reducers/Movie';
import { getGenres } from 'redux/movies/reducers/Genre';
import { getRoles } from 'redux/movies/reducers/Roles';
import useAsyncError from 'hooks/useAsyncError';
import { useDispatch, useSelector } from 'react-redux';
import Movie from 'models/Movie';
import * as selectors from 'redux/movies/selectors';
import MovieCard from 'components/MovieCard';
import CreateOrEditMovie from 'features/AdminDashboard/CreateOrEditMovie';
import Genre from 'models/Genre';
import Role from 'models/Role';
import { Backdrop, CircularProgress } from '@mui/material';
import { Helmet } from 'react-helmet';

const ManageMovies = () => {
    const [filterMovieRequest, setFilterMovieRequest] =
        useState<FilterMoviesRequest>(new FilterMoviesRequest());

    const dispatch = useDispatch();
    const movies: Movie[] = useSelector(selectors.getMovies);

    const genresStatus = useSelector(selectors.getGenresStatus);
    const rolesStatus = useSelector(selectors.getRolesStatus);

    const isDataLoaded =
        genresStatus === 'success' && rolesStatus === 'success';

    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

    useEffect(() => {
        dispatch(filterMovies(filterMovieRequest));
        dispatch(getGenres());
        dispatch(getRoles());
    }, [filterMovieRequest, dispatch]);

    if (!isDataLoaded) {
        return (
            <Backdrop open={true}>
                <CircularProgress />
            </Backdrop>
        );
    }

    return (
        <Fragment>
            <Helmet>
                <title>Admin dashboard | Projektor</title>
            </Helmet>
            <Container>
                {movies.map((movie) => (
                    <MovieCard
                        movie={movie}
                        onClick={() => setSelectedMovie(movie)}
                    />
                ))}
                {selectedMovie && (
                    <CreateOrEditMovie
                        movie={selectedMovie}
                        onClose={() => setSelectedMovie(null)}
                    />
                )}
            </Container>
        </Fragment>
    );
};

export default ManageMovies;
