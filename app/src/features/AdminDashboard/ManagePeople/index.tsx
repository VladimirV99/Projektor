import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import FilterMoviesRequest from 'models/Movie/FilterMoviesRequest';
import { searchPeopleAdmin } from 'redux/movies/reducers/People';
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
import Person from 'models/Movie/Person';

const ManagePeople = () => {
    const [searchPeopleRequest, setSearchPeopleRequest] = useState<{
        searchString: string | null;
        page: number;
    }>({
        searchString: null,
        page: 1,
    });

    const peopleCount = useSelector(selectors.getPeopleCount);

    const numberOfPages = useMemo(() => {
        return Math.ceil(peopleCount / 10);
    }, [peopleCount]);

    const [searchStringInput, setSearchStringInput] = useState(
        searchPeopleRequest.searchString ?? ''
    );

    const [debouncedSearchString] = useDebounce(searchStringInput, 500);

    useEffect(() => {
        if (
            searchPeopleRequest.searchString &&
            searchPeopleRequest.searchString === debouncedSearchString
        ) {
            return;
        }
        setSearchPeopleRequest({
            ...searchPeopleRequest,
            searchString: debouncedSearchString,
            page: 1,
        });
    }, [debouncedSearchString]);

    const dispatch = useDispatch();
    const people: Person[] = useSelector(selectors.getPeople);

    useEffect(() => {
        console.log(people);
    }, [people]);

    const peopleStatus = useSelector(selectors.getPeopleStatus);

    const isDataLoaded = peopleStatus === 'success';

    const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
    const [deletePersonId, setDeletePersonId] = useState<number | null>(null);

    useEffect(() => {
        dispatch(
            searchPeopleAdmin({
                searchString: searchPeopleRequest.searchString ?? '',
                page: searchPeopleRequest.page,
            })
        );
    }, [searchPeopleRequest, dispatch]);

    const renderPagination = () => (
        <Pagination
            count={numberOfPages}
            page={searchPeopleRequest.page}
            onChange={(e, page) => {
                setSearchPeopleRequest({
                    ...searchPeopleRequest,
                    page: page,
                });
            }}
        />
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

    const renderFullName = useCallback(({ firstName, lastName }) => {
        const fullName = `${firstName} ${lastName}`;
        const displayFullName =
            fullName.length > 30 ? `${fullName.substring(0, 30)}...` : fullName;
        return displayFullName;
    }, []);

    return (
        <Fragment>
            <Helmet>
                <title>Admin dashboard | Projektor</title>
            </Helmet>
            {!isDataLoaded && (
                <Backdrop open={true}>
                    <CircularProgress />
                </Backdrop>
            )}
            <SearchAndPaginationContainer>
                <SearchContainer>
                    <TextField
                        value={searchStringInput ?? ''}
                        label="Search people"
                        onChange={(e) => {
                            setSearchStringInput(e.target.value);
                        }}
                    />
                    <Button onClick={() => setSelectedPerson(new Person())}>
                        <FontAwesomeIcon icon={faPlus} />
                        New person
                    </Button>
                </SearchContainer>
                {renderPagination()}
            </SearchAndPaginationContainer>

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell align="left">Full Name</TableCell>
                            <TableCell align="right">IMDB Url</TableCell>
                            <TableCell align="right">Movies</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {people.map((person) => (
                            <TableRow
                                key={person.id}
                                sx={{
                                    '&:last-child td, &:last-child th': {
                                        border: 0,
                                    },
                                }}
                            >
                                <TableCell component="th" scope="row">
                                    {person.id}
                                </TableCell>
                                <TableCell align="right">
                                    {renderFullName(person)}
                                </TableCell>
                                <TableCell align="right">
                                    {person.imdbUrl &&
                                        renderLink(person.imdbUrl)}
                                </TableCell>
                                <TableCell align="right">
                                    movies go here
                                </TableCell>
                                <TableCell align="right">
                                    <Button>
                                        <FontAwesomeIcon icon={faEdit} />
                                    </Button>
                                    <Button>
                                        <FontAwesomeIcon icon={faTrash} />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <PaginationContainer>{renderPagination()}</PaginationContainer>
            <Modal show={deletePersonId !== null}>
                <Modal.Header>
                    <Modal.Title></Modal.Title>
                </Modal.Header>
                <Modal.Body></Modal.Body>
                <Modal.Footer></Modal.Footer>
            </Modal>
        </Fragment>
    );
};

export default ManagePeople;

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
