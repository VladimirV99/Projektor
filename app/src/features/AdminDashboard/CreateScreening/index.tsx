import { Fragment, useState } from 'react';
import styled from 'styled-components';
import { Button, TextField } from '@mui/material';
import { Modal } from 'react-bootstrap';
import Screening from 'models/Screening';
import SearchInput from '../SearchInput';
import {
    GET_MOVIES_BY_SEARCH_STRING,
    GET_HALLS_BY_SEARCH_STRING,
    INSERT_SCREENING_URL,
} from 'constants/api/screenings';
import { DateTimePicker } from '@mui/lab';
import dayjs from 'dayjs';
import axiosAuthInstance from 'axios/instance';

type Props = {
    screening: Screening;
    onClose: () => void;
    callback: () => void;
};

const CreateScreening = ({ screening, onClose, callback }: Props) => {
    const [screeningInput, setScreeningInput] = useState<Screening>({
        ...screening,
    });
    const [createStatus, setCreateStatus] = useState('idle');
    const [createError, setCreateError] = useState<string | null>(null);
    const [selectedMovieId, setSelectedMovieId] = useState(screening.movie?.id);
    const [selectedHallId, setSelectedHallId] = useState(screening.hall?.id);

    const handleCreateSubmit = () => {
        setCreateStatus('pending');
        if (isNaN(Date.parse(screeningInput.movieStart)) === true) {
            setCreateError('Date is invalid');
            setCreateStatus('error');
            return;
        }
        axiosAuthInstance
            .post(INSERT_SCREENING_URL, {
                movieId: selectedMovieId,
                hallId: selectedHallId,
                movieStart: screeningInput.movieStart,
            })
            .then((response) => {
                callback();
                setCreateStatus('success');
            })
            .catch((error) => {
                setCreateStatus('error');
                setCreateError(
                    error.response?.data ??
                        'Something went wrong. Please try again later'
                );
            });
    };

    return (
        <Fragment>
            <Modal show={createStatus !== 'idle'}>
                <Modal.Header>
                    <Modal.Title>Creating a screening</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {createStatus === 'pending' && (
                        <div>Creating screening...</div>
                    )}
                    {createStatus === 'success' && (
                        <div>Screening created successfully!</div>
                    )}
                    {createStatus === 'error' && <div>{createError}</div>}
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        disabled={createStatus === 'pending'}
                        onClick={onClose}
                    >
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={createStatus === 'idle'}>
                <Modal.Header>
                    {screening.id != -1 ? (
                        <h4>
                            Editing:{' '}
                            <i>
                                {screening.movie?.title} {screening.hall!.name}
                            </i>
                        </h4>
                    ) : (
                        <FormInputFieldTitle>
                            Create a new screening
                        </FormInputFieldTitle>
                    )}
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
                        renderInput={(props) => (
                            <TextField {...props} fullWidth />
                        )}
                        ampm={false}
                    />
                    <div>
                        <FormInputFieldTitle>Movie</FormInputFieldTitle>
                        <SearchInput
                            searchEndpoint={GET_MOVIES_BY_SEARCH_STRING}
                            getOptions={(movies) =>
                                movies.map(({ id, title, length }) => ({
                                    id,
                                    label: `${title} ${length}`,
                                }))
                            }
                            onOptionClicked={({ id, label }) => {
                                setSelectedMovieId(id);
                            }}
                            extractData={(data) => data.movies}
                        />
                    </div>
                    <div>
                        <FormInputFieldTitle>Hall</FormInputFieldTitle>
                        <SearchInput
                            searchEndpoint={GET_HALLS_BY_SEARCH_STRING}
                            getOptions={(halls) =>
                                halls.map(({ id, name }) => ({
                                    id,
                                    label: `${name}`,
                                }))
                            }
                            onOptionClicked={({ id, label }) => {
                                setSelectedHallId(id);
                            }}
                        />
                    </div>
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
                            Create screening
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

export default CreateScreening;

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
