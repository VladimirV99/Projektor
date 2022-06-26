import { Fragment, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { Button, TextField } from '@mui/material';
import * as selectors from 'redux/movies/selectors';
import { useSelector } from 'react-redux';
import { Modal } from 'react-bootstrap';
import Person from 'models/Movie/Person';
import {
    createOrUpdatePerson,
    patchPerson,
    resetPeopleUpdateStatus,
} from 'redux/movies/reducers/People';
import CreateOrUpdatePersonRequest from 'models/People';

type Props = {
    person: Person;
    onClose: () => void;
};

const CreateOrEditPerson = ({ person, onClose }: Props) => {
    const [personInput, setPersonInput] = useState({ ...person });

    const dispatch = useDispatch();
    const updateStatus = useSelector(selectors.getPeopleUpdateStatus);

    const handleSubmit = () => {
        const personRequest = new CreateOrUpdatePersonRequest(
            personInput.id,
            personInput.firstName,
            personInput.lastName,
            personInput.imdbUrl
        );
        dispatch(createOrUpdatePerson(personRequest));
    };

    return (
        <Fragment>
            <Modal show={updateStatus !== 'idle'}>
                <Modal.Header>
                    <Modal.Title>
                        {person.id == -1 ? 'Creating' : 'Updating'} a person
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {updateStatus === 'pending' && (
                        <div>Updating person...</div>
                    )}
                    {updateStatus === 'success' && (
                        <div>
                            Person {person.id === -1 ? 'created' : 'updated'}{' '}
                            successfully!
                        </div>
                    )}
                    {updateStatus === 'error' && (
                        <div>Something went wrong.</div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        disabled={updateStatus === 'pending'}
                        onClick={() => {
                            if (updateStatus === 'success') {
                                dispatch(patchPerson(personInput));
                                onClose();
                            }
                            dispatch(resetPeopleUpdateStatus());
                        }}
                    >
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={updateStatus === 'idle'}>
                <Modal.Header>
                    {person.id != -1 ? (
                        <h4>
                            Editing:{' '}
                            <i>
                                {person.firstName} {person.lastName}
                            </i>{' '}
                        </h4>
                    ) : (
                        <FormInputFieldTitle>
                            Create a new person
                        </FormInputFieldTitle>
                    )}
                </Modal.Header>

                <Modal.Body>
                    <FormTextInputField>
                        <TextField
                            value={personInput.firstName}
                            label="First Name"
                            onChange={(e) => {
                                setPersonInput({
                                    ...personInput,
                                    firstName: e.target.value,
                                });
                            }}
                            fullWidth
                        />
                    </FormTextInputField>
                    <FormTextInputField>
                        <TextField
                            value={personInput.lastName}
                            label="Last Name"
                            onChange={(e) => {
                                setPersonInput({
                                    ...personInput,
                                    lastName: e.target.value,
                                });
                            }}
                            fullWidth
                        />
                    </FormTextInputField>
                    <FormTextInputField>
                        <TextField
                            value={personInput.imdbUrl}
                            label="IMDB Url"
                            onChange={(e) =>
                                setPersonInput({
                                    ...personInput,
                                    imdbUrl: e.target.value,
                                })
                            }
                            fullWidth
                        />
                    </FormTextInputField>
                </Modal.Body>

                <Modal.Footer>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                        }}
                    >
                        <Button variant="contained" onClick={handleSubmit}>
                            {personInput.id != -1
                                ? 'Update a person'
                                : 'Create a person'}
                        </Button>
                        <Button variant="contained" onClick={onClose}>
                            Close
                        </Button>
                    </div>
                </Modal.Footer>
            </Modal>
        </Fragment>
    );
};

export default CreateOrEditPerson;

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
