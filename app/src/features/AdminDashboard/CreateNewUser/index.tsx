import { Fragment, useState } from 'react';
import styled from 'styled-components';
import { Button, TextField } from '@mui/material';
import { Modal } from 'react-bootstrap';
import CreateUserRequest from 'models/User/CreateUserRequest';
import { INSERT_ADMIN } from 'constants/api/user';
import axiosAuthInstance from 'axios/instance';

type Props = {
    user: CreateUserRequest;
    onClose: () => void;
    onBackdropClick: () => void;
    callback: () => void;
};

const CreateNewUser = ({ user, onClose, onBackdropClick, callback }: Props) => {
    const [userInput, setUserInput] = useState<CreateUserRequest>({ ...user });
    const [createStatus, setCreateStatus] = useState('idle');

    const handleCreateSubmit = () => {
        setCreateStatus('pending');
        axiosAuthInstance
            .post(INSERT_ADMIN, {
                firstName: userInput.firstName,
                lastName: userInput.lastName,
                email: userInput.email,
                password: userInput.password,
            })
            .then((response) => {
                onClose();
                callback();
                setCreateStatus('idle');
            })
            .catch((error) => {
                onClose();
                setCreateStatus('error');
            });
    };

    return (
        <Fragment>
            <Modal
                show={createStatus === 'idle'}
                onBackdropClick={onBackdropClick}
            >
                <Modal.Header>
                    {user.id != -1 ? (
                        <h4>
                            Creating:{' '}
                            <i>
                                {user.firstName} {user.lastName}
                            </i>
                        </h4>
                    ) : (
                        <FormInputFieldTitle>
                            Create a new administrator
                        </FormInputFieldTitle>
                    )}
                </Modal.Header>

                <Modal.Body>
                    <FormTextInputField>
                        <TextField
                            label="First name"
                            value={userInput.firstName ?? ''}
                            onChange={(e) => {
                                setUserInput({
                                    ...userInput,
                                    firstName: e.target.value,
                                });
                            }}
                            fullWidth
                        />
                    </FormTextInputField>
                    <FormTextInputField>
                        <TextField
                            label="Last name"
                            value={userInput.lastName ?? ''}
                            onChange={(e) => {
                                setUserInput({
                                    ...userInput,
                                    lastName: e.target.value,
                                });
                            }}
                            fullWidth
                        />
                    </FormTextInputField>
                    <FormTextInputField>
                        <TextField
                            label="Email"
                            value={userInput.email ?? ''}
                            onChange={(e) => {
                                setUserInput({
                                    ...userInput,
                                    email: e.target.value,
                                });
                            }}
                            fullWidth
                        />
                    </FormTextInputField>
                    <FormTextInputField>
                        <TextField
                            label="Password"
                            type="password"
                            value={userInput.password ?? ''}
                            onChange={(e) => {
                                setUserInput({
                                    ...userInput,
                                    password: e.target.value,
                                });
                            }}
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
                        <Button
                            variant="contained"
                            onClick={handleCreateSubmit}
                        >
                            Create administrator
                        </Button>
                        <Button
                            variant="contained"
                            onClick={() => {
                                onClose();
                                setCreateStatus('idle');
                            }}
                        >
                            Close
                        </Button>
                    </div>
                </Modal.Footer>
            </Modal>
        </Fragment>
    );
};

export default CreateNewUser;

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
