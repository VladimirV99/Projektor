import { Fragment, useState } from 'react';
import styled from 'styled-components';
import { Button, TextField } from '@mui/material';
import { Modal } from 'react-bootstrap';
import Screening from 'models/Screening';
import { UPDATE_SCREENING_URL } from 'constants/api/screenings';
import axios from 'axios';
import { DateTimePicker } from '@mui/lab';
import dayjs from 'dayjs';

type Props = {
    screening: Screening;
    onClose: () => void;
    onBackdropClick: () => void;
    callback: () => void;
};

const UpdateScreening = ({
    screening,
    onClose,
    onBackdropClick,
    callback,
}: Props) => {
    const [screeningInput, setScreeningInput] = useState<Screening>({
        ...screening,
    });
    const [updateStatus, setUpdateStatus] = useState('idle');
    const [createStatus, setCreateStatus] = useState('idle');

    const handleUpdateSubmit = () => {
        setCreateStatus('pending');
        axios
            .patch(UPDATE_SCREENING_URL, {
                screeningId: screeningInput.id,
                moment: screeningInput.movieStart,
            })
            .then((response) => {
                callback();
                setUpdateStatus('success');
            })
            .catch((error) => setUpdateStatus('error'));
    };

    return (
        <Fragment>
            <Modal show={updateStatus !== 'idle'}>
                <Modal.Header>
                    <Modal.Title>Update a screening</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {updateStatus === 'pending' && (
                        <div>Updating screening...</div>
                    )}
                    {updateStatus === 'success' && (
                        <div>Screening updated successfully!</div>
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
                                onClose();
                            }
                            setUpdateStatus('idle');
                        }}
                    >
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal
                show={updateStatus === 'idle'}
                onBackdropClick={onBackdropClick}
            >
                <Modal.Header>
                    <h4>
                        Editing:{' '}
                        <i>
                            {screening.movie?.title} | {screening.hall!.name}
                        </i>
                    </h4>
                </Modal.Header>

                <Modal.Body>
                    <DateTimePicker
                        label={'Movie start'}
                        onChange={(value) => {
                            setScreeningInput({
                                ...screeningInput,
                                movieStart: dayjs(value!).format(
                                    'YYYY-MM-DDTHH:mm:ss'
                                ),
                            });
                        }}
                        value={new Date(screeningInput.movieStart)}
                        renderInput={(props) => <TextField {...props} />}
                        ampm={false}
                    />
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
                            onClick={handleUpdateSubmit}
                        >
                            Update screening
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

export default UpdateScreening;

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
