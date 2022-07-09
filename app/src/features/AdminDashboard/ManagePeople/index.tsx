import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import {
    deletePerson,
    resetPeopleDeleteStatus,
    searchPeopleAdmin,
} from 'redux/movies/reducers/People';
import { useDispatch, useSelector } from 'react-redux';
import * as selectors from 'redux/movies/selectors';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
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
import { Link } from 'react-router-dom';
import CreateOrEditPerson from '../CreateOrEditPerson';
import PageTitle from 'components/PageTitle';
import DeleteModal from 'components/DeleteModal';

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

    const [selectedPersonForMoviesModal, setSelectedPersonForMoviesModal] =
        useState<Person | null>(null);

    const [debouncedSearchString] = useDebounce(searchStringInput, 500);

    const deleteStatus = useSelector(selectors.getPeopleDeleteStatus);

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

    const peopleStatus = useSelector(selectors.getPeopleStatus);

    const isDataLoaded = peopleStatus === 'success';

    const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
    const [deletePersonId, setDeletePersonId] = useState<number | null>(null);

    const deletePersonFullName = useMemo(() => {
        const person = people.find(({ id }) => id === deletePersonId);
        if (!person) {
            return '';
        }
        return `${person.firstName} ${person.lastName}`;
    }, [deletePersonId, people]);

    useEffect(() => {
        dispatch(
            searchPeopleAdmin({
                searchString: searchPeopleRequest.searchString ?? '',
                page: searchPeopleRequest.page,
            })
        );
    }, [searchPeopleRequest, dispatch]);

    const handleDeletePerson = () => {
        if (
            deletePersonId === null ||
            !people.find(({ id }) => id === deletePersonId)
        ) {
            setDeletePersonId(null);
        }
        dispatch(deletePerson(deletePersonId ?? -1));
    };

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

    const renderMoviesModal = (person: Person) => {
        return (
            <Modal
                show={
                    selectedPersonForMoviesModal !== null &&
                    selectedPersonForMoviesModal.id === person.id
                }
            >
                <Modal.Header>
                    <Modal.Title>
                        {person.firstName} {person.lastName} - Movies
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {person.movies.length === 0
                        ? 'This person has no movies'
                        : person.movies.map((movie) => (
                              <div key={movie.id}>
                                  <Link
                                      to={`/movie/${movie.id}`}
                                      target="_blank"
                                  >
                                      {movie.title}
                                  </Link>
                              </div>
                          ))}
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        onClick={() => setSelectedPersonForMoviesModal(null)}
                    >
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    };

    return (
        <Fragment>
            <PageTitle title="Manage people" />
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
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {people.map((person) => (
                            <TableRow
                                sx={{
                                    '&:last-child td, &:last-child th': {
                                        border: 0,
                                    },
                                }}
                                key={person.id}
                            >
                                {renderMoviesModal(person)}
                                <TableCell component="th" scope="row">
                                    {person.id}
                                </TableCell>
                                <TableCell align="left">
                                    {renderFullName(person)}
                                </TableCell>
                                <TableCell align="right">
                                    {person.imdbUrl &&
                                        renderLink(person.imdbUrl)}
                                </TableCell>
                                <TableCell align="right">
                                    <Button
                                        onClick={() => {
                                            setSelectedPersonForMoviesModal(
                                                person
                                            );
                                        }}
                                    >
                                        Show movies
                                    </Button>
                                </TableCell>
                                <TableCell align="right">
                                    <Button
                                        onClick={() =>
                                            setSelectedPerson(person)
                                        }
                                    >
                                        <FontAwesomeIcon icon={faEdit} />
                                    </Button>
                                    <Button
                                        onClick={() =>
                                            setDeletePersonId(person.id)
                                        }
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
            {selectedPerson && (
                <CreateOrEditPerson
                    person={selectedPerson}
                    onClose={() => {
                        setSelectedPerson(null);
                        dispatch(
                            searchPeopleAdmin({
                                searchString:
                                    searchPeopleRequest.searchString ?? '',
                                page: searchPeopleRequest.page,
                            })
                        );
                    }}
                />
            )}
            {deletePersonId !== null && (
                <DeleteModal
                    onSubmit={handleDeletePerson}
                    onClose={() => {
                        setDeletePersonId(null);
                        dispatch(resetPeopleDeleteStatus());
                    }}
                    entityName="person"
                    errorMessage={null}
                    title={`Delete person: ${deletePersonFullName}?`}
                    deleteStatus={deleteStatus}
                />
            )}
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
