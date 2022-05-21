import { Fragment, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { Button, TextField } from '@mui/material';
import { Col, Modal, Row } from 'react-bootstrap';
import CreateOrUpdateScreeningRequest from 'models/Screening/CreateOrUpdateScreeningRequest';
import Screening from 'models/Screening';

type Props = {
    screening: Screening;
    onClose: () => void;
    onBackdropClick: () => void;
};

const CreateOrEditScreening = ({ screening, onClose, onBackdropClick }: Props) => {
    const [screeningInput, setScreeningInput] = useState<Screening>({ ...screening });
    const [updateStatus, setUpdateStatus] = useState('idle');

    const dispatch = useDispatch();

    const handleSubmit = () => {
        const screeningRequest = new CreateOrUpdateScreeningRequest(
            screeningInput.id,
            screeningInput.movie!,
            screeningInput.hall!,
            new Date(screeningInput.movieStart)
        );

        // dispatch(createOrUpdateMovie(movieRequest));
    };

    return (
        <Fragment>
            <Modal show={updateStatus !== 'idle'}>
                <Modal.Header>
                    <Modal.Title>
                        {screening.id == -1 ? 'Creating' : 'Updating'} a movie
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {updateStatus === 'pending' && <div>Updating screening...</div>}
                    {updateStatus === 'success' && (
                        <div>
                            Movie {screening.id === -1 ? 'created' : 'updated'}{' '}
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
                                // dispatch(patchMovie(screening));
                                onClose();
                            }
                            // dispatch(resetUpdateStatus());
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
                    {screening.id != -1 ? (
                        <h4>
                            Editing: <i>{screening.movie?.title} {screening.hall!.name}</i>
                        </h4>
                    ) : (
                        <FormInputFieldTitle>
                            Create a new screening
                        </FormInputFieldTitle>
                    )}
                </Modal.Header>

                <Modal.Body>
                </Modal.Body>

                <Modal.Footer>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                        }}
                    >
                        <Button variant="contained" onClick={handleSubmit}>
                            {screening.id != -1
                                ? 'Update screening'
                                : 'Create screening'}
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

export default CreateOrEditScreening;

const FormInputFieldTitle = styled.div`
    font-size: 20px;
    font-weight: bold;
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
