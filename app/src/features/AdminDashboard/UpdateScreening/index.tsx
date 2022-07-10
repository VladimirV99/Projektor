import { useState } from 'react';
import styled from 'styled-components';
import { TextField } from '@mui/material';
import { Button, Modal } from 'react-bootstrap';
import Screening from 'models/Screening';
import { UPDATE_SCREENING_URL } from 'constants/api/screenings';
import { DateTimePicker } from '@mui/lab';
import dayjs from 'dayjs';
import axiosAuthInstance from 'axios/instance';
import { Status } from 'constants/common';

type Props = {
    screening: Screening;
    onClose: () => void;
    onUpdate: () => void;
};

const UpdateScreening = ({ screening, onClose, onUpdate }: Props) => {
    const [screeningInput, setScreeningInput] = useState<Screening>({
        ...screening,
    });

    const [updateStatus, setUpdateStatus] = useState<Status>('idle');
    const [updateError, setUpdateError] = useState<string | null>(null);

    const handleUpdateSubmit = () => {
        setUpdateStatus('pending');
        axiosAuthInstance
            .patch(UPDATE_SCREENING_URL, {
                screeningId: screeningInput.id,
                moment: screeningInput.movieStart,
            })
            .then((response) => {
                onUpdate();
                setUpdateStatus('success');
            })
            .catch((error) => {
                setUpdateStatus('error');
                setUpdateError(
                    error.response?.data ??
                        'Something went wrong. Please try again later.'
                );
            });
    };

    return (
        <Modal show={true}>
            <Modal.Header>
                <Modal.Title>
                    Editing: <em>{screening.movie?.title} </em>|
                    <em>{screening.hall!.name}</em>
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {updateStatus === 'idle' && (
                    <DateTimePicker
                        label="Movie start"
                        minDateTime={new Date()}
                        onChange={(value) => {
                            setScreeningInput({
                                ...screeningInput,
                                movieStart: dayjs(value!).format(
                                    'YYYY-MM-DDTHH:mm:ss'
                                ),
                            });
                        }}
                        value={new Date(screeningInput.movieStart)}
                        renderInput={(props) => (
                            <TextField {...props} fullWidth />
                        )}
                        ampm={false}
                    />
                )}
                {updateStatus === 'pending' && <div>Updating screening...</div>}
                {updateStatus === 'success' && (
                    <div>Screening updated successfully!</div>
                )}
                {updateStatus === 'error' && <div>{updateError}</div>}
            </Modal.Body>
            <Modal.Footer>
                <Button
                    variant="secondary"
                    onClick={() => {
                        onClose();
                        setUpdateStatus('idle');
                    }}
                    disabled={updateStatus === 'pending'}
                >
                    Close
                </Button>
                <Button
                    variant="primary"
                    onClick={handleUpdateSubmit}
                    disabled={isNaN(Date.parse(screeningInput.movieStart))}
                >
                    Update screening
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default UpdateScreening;

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
