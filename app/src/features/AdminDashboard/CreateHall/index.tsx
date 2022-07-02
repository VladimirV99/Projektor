import { Fragment, useState } from 'react';
import { Button, TextField } from '@mui/material';
import axiosAuthInstance from 'axios/instance';
import { CREATE_HALL_URL } from 'constants/api/reservations';
import useAsyncError from 'hooks/useAsyncError';
import { HallAdmin } from 'models/Hall';
import { Modal } from 'react-bootstrap';
import styled from 'styled-components';

const MIN_COLS = 1;
const MAX_COLS = 50;
const MIN_ROWS = 1;
const MAX_ROWS = 50;

type Props = {
    onClose: () => void;
    onSuccess: () => void;
};

const CreateHall = ({ onClose, onSuccess }: Props) => {
    const [status, setStatus] = useState('idle');
    const [hallInput, setHallInput] = useState(new HallAdmin(-1, '', 10, 10));

    const throwAsyncError = useAsyncError();

    const handleSubmit = () => {
        setStatus('pending');
        axiosAuthInstance
            .post(CREATE_HALL_URL, {
                name: hallInput.name,
                rows: hallInput.rows,
                columns: hallInput.columns,
            })
            .then((res) => {
                setStatus('success');
                onSuccess();
            })
            .catch((err) => {
                setStatus('error');
            });
    };

    return (
        <Modal show={true}>
            <StyledModalHeader>Create a hall</StyledModalHeader>
            <StyledModalBody
                style={{ display: 'flex', flexDirection: 'column' }}
            >
                {status === 'success' && <p>Hall successfully created</p>}
                {status === 'pending' && <p>Loading...</p>}
                {status === 'error' && (
                    <p>Something went wrong. Please try again.</p>
                )}
                {(status === 'idle' || status === 'error') && (
                    <Fragment>
                        <StyledTextField
                            label="Name"
                            value={hallInput.name}
                            onChange={(e) =>
                                setHallInput({
                                    ...hallInput,
                                    name: e.target.value,
                                })
                            }
                        />
                        <StyledTextField
                            label="Number of rows"
                            value={hallInput.rows}
                            onChange={(e) => {
                                const v = parseInt(e.target.value);
                                if (v < MIN_ROWS || v > MAX_ROWS) {
                                    return;
                                }
                                setHallInput({
                                    ...hallInput,
                                    rows: v,
                                });
                            }}
                            type="number"
                        />
                        <StyledTextField
                            label="Number of columns"
                            value={hallInput.columns}
                            onChange={(e) => {
                                const v = parseInt(e.target.value);
                                if (v < MIN_COLS || v > MAX_COLS) {
                                    return;
                                }
                                setHallInput({
                                    ...hallInput,
                                    columns: v,
                                });
                            }}
                            type="number"
                        />
                    </Fragment>
                )}
            </StyledModalBody>

            <Modal.Footer>
                <Button onClick={onClose} disabled={status === 'pending'}>
                    Close
                </Button>
                <Button
                    disabled={
                        status === 'pending' ||
                        status === 'success' ||
                        hallInput.name.trim().length === 0
                    }
                    onClick={handleSubmit}
                >
                    Submit
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CreateHall;

const StyledModalHeader = styled(Modal.Header)`
    font-size: 24px;
`;

const StyledModalBody = styled(Modal.Body)`
    display: flex;
    flex-direction: column;
`;

const StyledTextField = styled(TextField)`
    margin-top: 10px;
    margin-bottom: 10px;
`;
