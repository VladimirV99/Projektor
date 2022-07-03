import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import FilterMoviesRequest from 'models/Movie/FilterMoviesRequest';
import {
    filterMovies,
    deleteMovie,
    resetDeleteStatus,
} from 'redux/movies/reducers/Movie';
import { getGenres } from 'redux/movies/reducers/Genre';
import { getRoles } from 'redux/movies/reducers/Roles';
import { useDispatch, useSelector } from 'react-redux';
import Movie from 'models/Movie';
import * as selectors from 'redux/movies/selectors';
import CreateOrEditMovie from 'features/AdminDashboard/CreateOrEditMovie';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Helmet } from 'react-helmet';
import {
    Backdrop,
    Button,
    CircularProgress,
    Pagination,
    TextField,
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-regular-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useDebounce } from 'use-debounce';
import { Modal } from 'react-bootstrap';
import PageTitle from 'components/PageTitle';
import DeleteModal from 'components/DeleteModal';

const ManageMovies = () => {
    const [filterMovieRequest, setFilterMovieRequest] =
        useState<FilterMoviesRequest>(new FilterMoviesRequest());

    const moviesCount = useSelector(selectors.getMoviesCount);

    const numberOfPages = useMemo(() => {
        return Math.ceil(moviesCount / filterMovieRequest.PerPage);
    }, [moviesCount, filterMovieRequest.PerPage]);

    const [searchStringInput, setSearchStringInput] = useState(
        filterMovieRequest.searchString ?? ''
    );
    const [debouncedSearchString] = useDebounce(searchStringInput, 500);

    useEffect(() => {
        if (
            filterMovieRequest.searchString &&
            filterMovieRequest.searchString === debouncedSearchString
        ) {
            return;
        }
        setFilterMovieRequest({
            ...filterMovieRequest,
            searchString: debouncedSearchString,
            Page: 1,
        });
    }, [debouncedSearchString]);

    const dispatch = useDispatch();
    const movies: Movie[] = useSelector(selectors.getMovies);

    const genresStatus = useSelector(selectors.getGenresStatus);
    const rolesStatus = useSelector(selectors.getRolesStatus);
    const deleteStatus = useSelector(selectors.getDeleteStatus);

    const isDataLoaded =
        genresStatus === 'success' && rolesStatus === 'success';

    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [deleteMovieId, setDeleteMovieId] = useState<number | null>(null);

    useEffect(() => {
        dispatch(getGenres());
        dispatch(getRoles());
    }, [dispatch]);

    useEffect(() => {
        dispatch(filterMovies(filterMovieRequest));
    }, [filterMovieRequest, dispatch]);

    const handleDeleteMovie = () => {
        if (
            deleteMovieId === null ||
            !movies.find(({ id }) => id === deleteMovieId)
        ) {
            setDeleteMovieId(null);
        }
        dispatch(deleteMovie(deleteMovieId ?? -1));
    };

    const renderPagination = () => (
        <Pagination
            count={numberOfPages}
            page={filterMovieRequest.Page}
            onChange={(e, page) => {
                setFilterMovieRequest({
                    ...filterMovieRequest,
                    Page: page,
                });
            }}
        />
    );

    const renderPeople = useCallback(
        (
            people: {
                personId: number;
                roleId: number;
                name: string;
                role: string;
            }[]
        ) => {
            const peopleString = people.map(({ name }) => name).join(', ');
            return (
                <Fragment>
                    {peopleString.length > 40
                        ? `${peopleString.substring(0, 40)}...`
                        : peopleString}
                </Fragment>
            );
        },
        []
    );

    const renderGenres = useCallback(
        (
            genres: {
                id: number;
                name: string;
            }[]
        ) => {
            const genresString = genres.map(({ name }) => name).join(', ');
            return (
                <Fragment>
                    {genresString.length > 40
                        ? `${genresString.substring(0, 40)}...`
                        : genresString}
                </Fragment>
            );
        },
        []
    );

    const renderLink = useCallback((link) => {
        return (
            <DisplayInline>
                <a href={link} target="_blank">
                    {link.length > 30 ? `${link.substring(0, 30)}...` : link}
                </a>
            </DisplayInline>
        );
    }, []);

    return (
        <Fragment>
            <PageTitle title="Manage movies" />
            {!isDataLoaded && (
                <Backdrop open={true}>
                    <CircularProgress />
                </Backdrop>
            )}
            <SearchAndPaginationContainer>
                <SearchContainer>
                    <TextField
                        value={searchStringInput ?? ''}
                        label="Search movies"
                        onChange={(e) => {
                            setSearchStringInput(e.target.value);
                        }}
                    />
                    <Button onClick={() => setSelectedMovie(new Movie())}>
                        <FontAwesomeIcon icon={faPlus} />
                        New movie
                    </Button>
                </SearchContainer>
                {renderPagination()}
            </SearchAndPaginationContainer>

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell align="left">Image</TableCell>
                            <TableCell align="right">Title</TableCell>
                            <TableCell align="right">Length</TableCell>
                            <TableCell align="right">Year</TableCell>
                            <TableCell align="right">Trailer</TableCell>
                            <TableCell align="right">IMDB</TableCell>
                            <TableCell align="right">Genres</TableCell>
                            <TableCell align="right">People</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {movies.map((movie) => (
                            <TableRow
                                key={movie.id}
                                sx={{
                                    '&:last-child td, &:last-child th': {
                                        border: 0,
                                    },
                                }}
                            >
                                <TableCell component="th" scope="row">
                                    {movie.id}
                                </TableCell>
                                <TableCell align="right">
                                    {movie.imageUrl ? (
                                        <img
                                            src={movie.imageUrl}
                                            style={{
                                                width: '100px',
                                                height: '100px',
                                            }}
                                            onClick={() =>
                                                navigator.clipboard.writeText(
                                                    movie.imageUrl ?? ''
                                                )
                                            }
                                        />
                                    ) : (
                                        <div>No image</div>
                                    )}
                                </TableCell>
                                <TableCell align="right">
                                    {movie.title.length > 30
                                        ? `${movie.title.substring(0, 30)}...`
                                        : movie.title}
                                </TableCell>
                                <TableCell align="right">
                                    {movie.length}min
                                </TableCell>
                                <TableCell align="right">
                                    {movie.year}
                                </TableCell>
                                <TableCell align="right">
                                    {movie.trailerUrl &&
                                        renderLink(movie.trailerUrl)}
                                </TableCell>
                                <TableCell align="right">
                                    {movie.imdbUrl && renderLink(movie.imdbUrl)}
                                </TableCell>
                                <TableCell align="right">
                                    {renderGenres(movie.genres)}
                                </TableCell>
                                <TableCell align="right">
                                    {renderPeople(movie.people)}
                                </TableCell>
                                <TableCell align="right">
                                    <Button
                                        onClick={() => setSelectedMovie(movie)}
                                    >
                                        <FontAwesomeIcon icon={faEdit} />
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            setDeleteMovieId(movie.id);
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <PaginationContainer>{renderPagination()}</PaginationContainer>
            {selectedMovie && (
                <CreateOrEditMovie
                    movie={selectedMovie}
                    onClose={() => setSelectedMovie(null)}
                />
            )}
            {deleteMovieId !== null && (
                <DeleteModal
                    onSubmit={handleDeleteMovie}
                    onClose={() => {
                        setDeleteMovieId(null);
                        dispatch(resetDeleteStatus());
                        if (deleteStatus === 'success') {
                            dispatch(filterMovies(filterMovieRequest));
                        }
                    }}
                    deleteStatus={deleteStatus}
                    entityName="movie"
                    errorMessage={null}
                    title={`Delete movie: ${
                        movies.find(({ id }) => id === deleteMovieId)?.title ??
                        ''
                    }`}
                />
            )}
        </Fragment>
    );
};

export default ManageMovies;

const DisplayInline = styled.div`
    display: inline-block;
`;

const SearchAndPaginationContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
`;

const SearchContainer = styled.div`
    display: flex;
    flex-direction: row;
`;

const PaginationContainer = styled.div`
    padding-top: 10px;
    display: flex;
    justify-content: flex-end;
`;
