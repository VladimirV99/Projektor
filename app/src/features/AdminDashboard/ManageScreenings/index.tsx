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
import { Backdrop, Button, CircularProgress } from '@mui/material';
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
import PageTitle from 'components/PageTitle';
import DeleteModal from 'components/DeleteModal';
import { Status } from 'constants/index';

const ManageScreenings = () => {
    const [screenings, setScreenings] = useState<Screening[] | null>(null);
    const [selectedScreening, setSelectedScreening] =
        useState<Screening | null>(null);
    const [deleteScreeningId, setDeleteScreeningId] = useState<number | null>(
        null
    );
    const [deleteStatus, setDeleteStatus] = useState<Status>('idle');
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
                getScreenings();
                setDeleteStatus('success');
            })
            .catch(() => setDeleteStatus('error'));
    };

    useEffect(() => {
        getScreenings();
    }, []);

    if (screenings === null)
        return (
            <Backdrop open={true}>
                <CircularProgress />
            </Backdrop>
        );

    return (
        <Fragment>
            <PageTitle title="Manage screenings" />
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
                    callback={getScreenings}
                />
            )}
            {selectedScreening && updateModal && (
                <UpdateScreening
                    screening={selectedScreening}
                    onClose={() => setSelectedScreening(null)}
                    callback={getScreenings}
                />
            )}
            {deleteScreeningId !== null && (
                <DeleteModal
                    onSubmit={deleteScreening}
                    onClose={() => {
                        setDeleteScreeningId(null);
                        setDeleteStatus('idle');
                    }}
                    deleteStatus={deleteStatus}
                    entityName="screening"
                    title={null}
                    errorMessage={null}
                />
            )}
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
