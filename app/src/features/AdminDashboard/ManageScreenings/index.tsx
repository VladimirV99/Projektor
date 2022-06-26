import { Fragment, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import axios from 'axios';
import Screening from 'models/Screening';
import styled from 'styled-components';
import { Button } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-regular-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Modal } from 'react-bootstrap';
import CreateScreening from '../CreateScreening';
import UpdateScreening from '../UpdateScreening';
import {
    GET_SCREENINGS_URL,
    DELETE_SCREENING_URL,
} from 'constants/api/screenings';
import axiosAuthInstance from 'axios/instance';

const ManageScreenings = () => {
    const [screenings, setScreenings] = useState<Screening[] | null>(null);
    const [selectedScreening, setSelectedScreening] =
        useState<Screening | null>(null);
    const [deleteScreeningId, setDeleteScreeningId] = useState<number | null>(
        null
    );
    const [deleteStatus, setDeleteStatus] = useState('idle');
    const [shouldRefresh, setShouldRefresh] = useState(false);
    const [updateModal, setUpdateModal] = useState(false);

    const getScreenings = () =>
        axios.get(GET_SCREENINGS_URL).then((response) => {
            setScreenings(response.data);
        });

    const deleteScreening = () => {
        setDeleteStatus('pending');
        axiosAuthInstance
            .delete(DELETE_SCREENING_URL(deleteScreeningId!))
            .then((response) => {
                setShouldRefresh(true);
                setDeleteStatus('success');
                setDeleteScreeningId(null);
            })
            .catch(() => setDeleteStatus('error'));
    };

    useEffect(() => {
        getScreenings();
    }, []);

    useEffect(() => {
        if (shouldRefresh) {
            getScreenings();
            setShouldRefresh(false);
        }
    }, [shouldRefresh]);

    if (screenings === null) return null;

    return (
        <Fragment>
            <Helmet>
                <title>Admin dashboard | Projektor</title>
            </Helmet>
            <AddScreeningContainer>
                <Button
                    onClick={() => {
                        setSelectedScreening(new Screening());
                        setUpdateModal(false);
                    }}
                >
                    <FontAwesomeIcon icon={faPlus} />
                    New Screening
                </Button>
            </AddScreeningContainer>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">ID</TableCell>
                            <TableCell align="left">Movie</TableCell>
                            <TableCell align="left">Movie start</TableCell>
                            <TableCell align="left">Movie length</TableCell>
                            <TableCell align="left">Hall</TableCell>
                            <TableCell align="left">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {screenings.map((screening) => (
                            <TableRow
                                key={screening.id}
                                sx={{
                                    '&:last-child td, &:last-child th': {
                                        border: 0,
                                    },
                                }}
                            >
                                <TableCell
                                    align="left"
                                    component="th"
                                    scope="row"
                                >
                                    {screening.id}
                                </TableCell>
                                <TableCell align="left">
                                    {screening.movie!.title}
                                </TableCell>
                                <TableCell align="left">
                                    {new Date(
                                        screening.movieStart
                                    ).toLocaleString()}
                                </TableCell>
                                <TableCell align="left">
                                    {screening.movie?.length} minutes
                                </TableCell>
                                <TableCell align="left">
                                    {screening.hall!.name}
                                </TableCell>
                                <TableCell align="left" height={100}>
                                    <Button
                                        onClick={() => {
                                            setSelectedScreening(screening);
                                            setUpdateModal(true);
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faEdit} />
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            setDeleteScreeningId(screening.id);
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {selectedScreening && !updateModal && (
                <CreateScreening
                    screening={selectedScreening}
                    onClose={() => setSelectedScreening(null)}
                    callback={() => setShouldRefresh(true)}
                />
            )}
            {selectedScreening && updateModal && (
                <UpdateScreening
                    screening={selectedScreening}
                    onClose={() => setSelectedScreening(null)}
                    callback={() => setShouldRefresh(true)}
                />
            )}
            <Modal show={deleteScreeningId !== null}>
                <Modal.Header>
                    <Modal.Title>
                        Delete screening:{' '}
                        {screenings.find(({ id }) => id === deleteScreeningId)
                            ?.movie?.title ?? ''}{' '}
                        {screenings.find(({ id }) => id === deleteScreeningId)
                            ?.hall?.name ?? ''}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {deleteStatus === 'idle' && (
                        <div>
                            Are you sure you want to delete this screening? This
                            action cannot be undone.
                        </div>
                    )}
                    {deleteStatus === 'pending' && <div>Please wait...</div>}
                    {deleteStatus === 'error' && (
                        <div>Something went wrong. Please try again.</div>
                    )}
                    {deleteStatus === 'success' && (
                        <div>Screening successfully deleted</div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    {(deleteStatus === 'success' ||
                        deleteStatus === 'error') && (
                        <Button
                            onClick={() => {
                                setDeleteScreeningId(null);
                                if (deleteStatus === 'success') {
                                    getScreenings();
                                }
                                setDeleteStatus('idle');
                            }}
                        >
                            Close
                        </Button>
                    )}
                    {(deleteStatus === 'idle' ||
                        deleteStatus === 'pending') && (
                        <Fragment>
                            <Button
                                disabled={deleteStatus === 'pending'}
                                onClick={() => {
                                    setDeleteScreeningId(null);
                                    setDeleteStatus('idle');
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={() => deleteScreening()}
                                disabled={deleteStatus === 'pending'}
                            >
                                Delete
                            </Button>
                        </Fragment>
                    )}
                </Modal.Footer>
            </Modal>
        </Fragment>
    );
};

export default ManageScreenings;

const AddScreeningContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
`;
