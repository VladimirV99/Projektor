import { useState } from 'react';
import styled from 'styled-components';
import { Stack, TextField } from '@mui/material';
import { Button, Modal } from 'react-bootstrap';
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
import { Status } from 'constants/common';

type CreateScreeningProps = {
    screening: Screening;
    onClose: () => void;
    onCreate: () => void;
};

type ScreeningInput = {
    movieId: number | undefined;
    hallId: number | undefined;
    movieStart: string;
};

const CreateScreening = ({
    onClose,
    onCreate,
}: CreateScreeningProps): JSX.Element => {
    const [screeningInput, setScreeningInput] = useState<ScreeningInput>({
        movieId: undefined,
        hallId: undefined,
        movieStart: '',
    });
    const [createStatus, setCreateStatus] = useState<Status>('idle');
    const [createError, setCreateError] = useState<string | null>(null);

    const handleCreateSubmit = () => {
        setCreateStatus('pending');
        if (isNaN(Date.parse(screeningInput.movieStart)) === true) {
            setCreateError('Date is invalid');
            setCreateStatus('error');
            return;
        }
        axiosAuthInstance
            .post(INSERT_SCREENING_URL, screeningInput)
            .then((response) => {
                onCreate();
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
        <Modal show={true}>
            <Modal.Header>
                <Modal.Title>Create a new screening</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {createStatus === 'idle' && (
                    <Stack spacing={3}>
                        <DateTimePicker
                            label="Movie start"
                            minDateTime={new Date()}
                            onChange={(value) => {
                                setScreeningInput({
                                    ...screeningInput,
                                    movieStart:
                                        value !== null
                                            ? dayjs(value).format(
                                                  'YYYY-MM-DDTHH:mm:ss'
                                              )
                                            : '',
                                });
                            }}
                            value={
                                screeningInput.movieStart !== ''
                                    ? new Date(screeningInput.movieStart)
                                    : null
                            }
                            renderInput={(props) => (
                                <TextField {...props} fullWidth />
                            )}
                            ampm={false}
                        />
                        <SearchInput
                            label="Movie"
                            searchEndpoint={GET_MOVIES_BY_SEARCH_STRING}
                            getOptions={(movies) =>
                                movies.map(({ id, title, length }) => ({
                                    id,
                                    label: title,
                                }))
                            }
                            onOptionClicked={({ id, label }) =>
                                setScreeningInput({
                                    ...screeningInput,
                                    movieId: id,
                                })
                            }
                            onInputCleared={() =>
                                setScreeningInput({
                                    ...screeningInput,
                                    movieId: undefined,
                                })
                            }
                            extractData={(data) => data.movies}
                        />
                        <SearchInput
                            label="Hall"
                            searchEndpoint={GET_HALLS_BY_SEARCH_STRING}
                            getOptions={(halls) =>
                                halls.map(({ id, name }) => ({
                                    id,
                                    label: name,
                                }))
                            }
                            onOptionClicked={({ id, label }) => {
                                setScreeningInput({
                                    ...screeningInput,
                                    hallId: id,
                                });
                            }}
                            onInputCleared={() =>
                                setScreeningInput({
                                    ...screeningInput,
                                    hallId: undefined,
                                })
                            }
                        />
                    </Stack>
                )}
                {createStatus === 'pending' && <div>Creating screening...</div>}
                {createStatus === 'success' && (
                    <div>Screening created successfully!</div>
                )}
                {createStatus === 'error' && <div>{createError}</div>}
            </Modal.Body>

            <Modal.Footer>
                <Button
                    variant="secondary"
                    onClick={onClose}
                    disabled={createStatus === 'pending'}
                >
                    Close
                </Button>
                {createStatus === 'idle' && (
                    <Button
                        variant="primary"
                        onClick={handleCreateSubmit}
                        disabled={
                            isNaN(Date.parse(screeningInput.movieStart)) ||
                            screeningInput.movieId === undefined ||
                            screeningInput.hallId === undefined
                        }
                    >
                        Create screening
                    </Button>
                )}
            </Modal.Footer>
        </Modal>
    );
};

export default CreateScreening;

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
