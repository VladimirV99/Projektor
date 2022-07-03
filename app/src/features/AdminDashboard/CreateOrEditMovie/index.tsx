import { Fragment, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import Movie from 'models/Movie';
import CreateOrUpdateMovieRequest from 'models/Movie/CreateOrUpdateMovieRequest';
import styled from 'styled-components';
import { Button, TextField } from '@mui/material';
import * as selectors from 'redux/movies/selectors';
import { useSelector } from 'react-redux';
import StaticSearchInput from '../StaticSearchInput';
import SelectedOptions from '../SelectedOptions';
import SearchInput from '../SearchInput';
import { SEARCH_PEOPLE_URL } from 'constants/api';
import {
    createOrUpdateMovie,
    patchMovie,
    resetUpdateStatus,
} from 'redux/movies/reducers/Movie';
import { Col, Modal, Row } from 'react-bootstrap';

type Props = {
    movie: Movie;
    onClose: () => void;
};

type PeopleByRolesType = {
    roleId: number;
    roleName: string;
    people: { personId: number; name: string }[];
}[];

const CreateOrEditMovie = ({ movie, onClose }: Props) => {
    const [movieInput, setMovieInput] = useState({ ...movie });
    const genres = useSelector(selectors.getGenres);
    const genreOptions = useMemo(
        () => genres.map(({ id, name }) => ({ id, label: name })),
        [genres]
    );
    const roles = useSelector(selectors.getRoles);

    const dispatch = useDispatch();
    const updateStatus = useSelector(selectors.getUpdateStatus);
    const updateError = useSelector(selectors.getUpdateError);

    const renderErrors = () => {
        return (
            <ul>
                {(updateError ?? '').split(',').map((updateError, idx) => (
                    <li key={idx}>{updateError}</li>
                ))}
            </ul>
        );
    };

    const peopleByRoles = useMemo<PeopleByRolesType>(() => {
        const peopleByRolesTmp = [] as PeopleByRolesType;
        movieInput.people.forEach(({ personId, roleId, role, name }) => {
            const roleIndex = peopleByRolesTmp.findIndex(
                (role) => role.roleId === roleId
            );
            if (roleIndex === -1) {
                peopleByRolesTmp.push({
                    roleId,
                    roleName: role,
                    people: [{ personId, name }],
                });
            } else {
                peopleByRolesTmp[roleIndex].people.push({ personId, name });
            }
        });
        roles.forEach(({ id, name }) => {
            if (peopleByRolesTmp.find((role) => role.roleId === id)) {
                return;
            }
            peopleByRolesTmp.push({
                roleId: id,
                roleName: name,
                people: [],
            });
        });
        return peopleByRolesTmp;
    }, [movieInput.people]);

    const handleSubmit = () => {
        const movieRequest = new CreateOrUpdateMovieRequest(
            movieInput.id,
            movieInput.title,
            movieInput.year,
            movieInput.length,
            movieInput.trailerUrl,
            movieInput.imdbUrl,
            movieInput.imageUrl,
            movieInput.people
                .filter(({ roleId }) => {
                    return peopleByRoles.find(
                        (role) =>
                            role.roleId === roleId && role.people.length > 0
                    );
                })
                .map(({ personId, roleId }) => ({ personId, roleId })),
            movieInput.genres.map(({ id }) => id)
        );

        dispatch(createOrUpdateMovie(movieRequest));
    };

    return (
        <Fragment>
            {updateStatus !== 'idle' && (
                <Modal show={true}>
                    <Modal.Header>
                        <Modal.Title>
                            {movie.id === -1 ? 'Creating' : 'Updating'} a movie
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {updateStatus === 'pending' && (
                            <div>
                                {movie.id === -1 ? 'Creating' : 'Updating'}{' '}
                                movie...
                            </div>
                        )}
                        {updateStatus === 'success' && (
                            <div>
                                Movie{' '}
                                {movieInput.id === -1 ? 'created' : 'updated'}{' '}
                                successfully!
                            </div>
                        )}
                        {updateStatus === 'error' && (
                            <div>{renderErrors()}</div>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            disabled={updateStatus === 'pending'}
                            onClick={() => {
                                if (updateStatus === 'success') {
                                    dispatch(patchMovie(movieInput));
                                    onClose();
                                }
                                dispatch(resetUpdateStatus());
                            }}
                        >
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
            {updateStatus === 'idle' && (
                <Modal show={true}>
                    <Modal.Header>
                        {movie.id != -1 ? (
                            <h4>
                                Editing: <i>{movieInput.title}</i> (
                                {movieInput.year})
                            </h4>
                        ) : (
                            <FormInputFieldTitle>
                                Create a new movie
                            </FormInputFieldTitle>
                        )}
                    </Modal.Header>

                    <Modal.Body>
                        <FormTextInputField>
                            <TextField
                                value={movieInput.title}
                                label="Title"
                                onChange={(e) => {
                                    setMovieInput({
                                        ...movieInput,
                                        title: e.target.value,
                                    });
                                }}
                                fullWidth
                            />
                        </FormTextInputField>
                        <FormTextInputField>
                            <TextField
                                value={movieInput.year}
                                label="Year"
                                type="number"
                                onChange={(e) => {
                                    setMovieInput({
                                        ...movieInput,
                                        year: parseInt(e.target.value, 10),
                                    });
                                }}
                                fullWidth
                            />
                        </FormTextInputField>
                        <FormTextInputField>
                            <TextField
                                value={movieInput.length}
                                type="number"
                                label="length"
                                onChange={(e) =>
                                    setMovieInput({
                                        ...movieInput,
                                        length: parseInt(e.target.value, 10),
                                    })
                                }
                                fullWidth
                            />
                        </FormTextInputField>
                        <FormTextInputField>
                            <FormInputFieldTitle>
                                Trailer URL
                            </FormInputFieldTitle>
                            <TextField
                                value={movieInput.trailerUrl ?? ''}
                                label="Trailer URL"
                                onChange={(e) => {
                                    setMovieInput({
                                        ...movieInput,
                                        trailerUrl: e.target.value,
                                    });
                                }}
                                fullWidth
                            />
                        </FormTextInputField>
                        <FormTextInputField>
                            <TextField
                                label="IMDB URL"
                                value={movieInput.imdbUrl ?? ''}
                                onChange={(e) => {
                                    setMovieInput({
                                        ...movieInput,
                                        imdbUrl: e.target.value,
                                    });
                                }}
                                fullWidth
                            />
                        </FormTextInputField>
                        <FormTextInputField>
                            <TextField
                                label="Image URL"
                                value={movieInput.imageUrl ?? ''}
                                onChange={(e) => {
                                    setMovieInput({
                                        ...movieInput,
                                        imageUrl: e.target.value,
                                    });
                                }}
                                fullWidth
                            />
                        </FormTextInputField>
                        <div>
                            <FormInputFieldTitle>People</FormInputFieldTitle>
                            {peopleByRoles.map(
                                ({ roleId, roleName, people }) => (
                                    <Fragment key={roleId}>
                                        <SelectedValuesWrapper>
                                            <RoleTitle>{roleName}</RoleTitle>
                                            {people.length === 0 && (
                                                <p>No people with this role.</p>
                                            )}
                                            <SelectedOptions
                                                direction="row"
                                                options={people.map(
                                                    ({ personId, name }) => ({
                                                        id: personId,
                                                        label: name,
                                                    })
                                                )}
                                                onDelete={(deletedPersonId) => {
                                                    setMovieInput({
                                                        ...movieInput,
                                                        people: movieInput.people.filter(
                                                            ({
                                                                personId:
                                                                    currentPersonId,
                                                                roleId: currentRoleId,
                                                            }) => {
                                                                if (
                                                                    currentPersonId ===
                                                                        deletedPersonId &&
                                                                    currentRoleId ===
                                                                        roleId
                                                                ) {
                                                                    return false;
                                                                }
                                                                return true;
                                                            }
                                                        ),
                                                    });
                                                }}
                                            />
                                            <div>Add {roleName}: </div>
                                            <SearchInput
                                                searchEndpoint={
                                                    SEARCH_PEOPLE_URL
                                                }
                                                getOptions={(people) =>
                                                    people.map(
                                                        ({
                                                            id,
                                                            firstName,
                                                            lastName,
                                                        }) => ({
                                                            id,
                                                            label: `${firstName} ${lastName}`,
                                                        })
                                                    )
                                                }
                                                onOptionClicked={({
                                                    id: clickedPersonId,
                                                    label: clickedPersonName,
                                                }) => {
                                                    if (
                                                        movieInput.people.find(
                                                            ({
                                                                personId,
                                                                roleId: currentRoleId,
                                                            }) =>
                                                                clickedPersonId ===
                                                                    personId &&
                                                                currentRoleId ===
                                                                    roleId
                                                        )
                                                    ) {
                                                    }
                                                    setMovieInput({
                                                        ...movieInput,
                                                        people: [
                                                            ...movieInput.people,
                                                            {
                                                                personId:
                                                                    clickedPersonId,
                                                                roleId: roleId,
                                                                role: roleName,
                                                                name: clickedPersonName,
                                                            },
                                                        ],
                                                    });
                                                }}
                                            />
                                        </SelectedValuesWrapper>
                                    </Fragment>
                                )
                            )}
                        </div>
                        <div>
                            <FormInputFieldTitle>Genres</FormInputFieldTitle>
                            <StaticSearchInput
                                staticOptions={genreOptions}
                                onOptionClicked={({ id, label }) => {
                                    if (
                                        movieInput.genres.find(
                                            (g) => g.id === id
                                        )
                                    ) {
                                        return;
                                    }
                                    setMovieInput({
                                        ...movieInput,
                                        genres: [
                                            ...movieInput.genres,
                                            { id, name: label },
                                        ],
                                    });
                                }}
                            />
                            <SelectedValuesWrapper>
                                {movieInput.genres.length === 0 && (
                                    <p>No genres added for this movie.</p>
                                )}
                                <SelectedOptions
                                    direction="row"
                                    options={movieInput.genres.map(
                                        ({ id, name }) => ({
                                            id,
                                            label: name,
                                        })
                                    )}
                                    onDelete={(id) => {
                                        setMovieInput({
                                            ...movieInput,
                                            genres: movieInput.genres.filter(
                                                (g) => g.id !== id
                                            ),
                                        });
                                    }}
                                />
                            </SelectedValuesWrapper>
                        </div>
                    </Modal.Body>

                    <Modal.Footer>
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                            }}
                        >
                            <Button variant="contained" onClick={handleSubmit}>
                                {movieInput.id != -1
                                    ? 'Update movie'
                                    : 'Create movie'}
                            </Button>
                            <Button variant="contained" onClick={onClose}>
                                Close
                            </Button>
                        </div>
                    </Modal.Footer>
                </Modal>
            )}
        </Fragment>
    );
};

export default CreateOrEditMovie;

const ModalContainer = styled.div`
    background-color: white;
    padding-left: 10px;
    padding-right: 10px;
    width: 600px;
    overflow-y: scroll;
`;

const FormInputFieldTitle = styled.div`
    font-size: 20px;
    font-weight: bold;
`;

const FormTextInputField = styled.div`
    padding-top: 10px;
    padding-bottom: 10px;
`;

export const SelectedValuesWrapper = styled.div`
    padding-top: 10px;
    padding-bottom: 10px;
    padding-left: 5px;
    padding-right: 5px;
    border: 1px solid #ccc;
    border-opacity: 0.5;
    border-radius: 1px;
    border-radius: 5px;
`;

export const RoleTitle = styled.div`
    font-size: 20px;
    font-style: italic;
    text-align: center;
`;
