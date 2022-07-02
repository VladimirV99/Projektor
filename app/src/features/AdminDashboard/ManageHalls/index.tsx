import { Fragment, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Screening from 'models/Screening';
import styled from 'styled-components';
import { Button } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-regular-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Modal } from 'react-bootstrap';
import axiosAuthInstance from 'axios/instance';
import useAsyncError from 'hooks/useAsyncError';
import { DELETE_HALL_URL, GET_HALLS_URL } from 'constants/api/reservations';
import CreateHall from '../CreateHall';
import { HallAdmin } from 'models/Hall';

const ManageHalls = () => {
    const [halls, setHalls] = useState<HallAdmin[]>([]);
    const [deleteHallId, setDeleteHallId] = useState<number | null>(null);
    const [deleteStatus, setDeleteStatus] = useState<string>('idle');
    const [deleteError, setDeleteError] = useState<string | null>(null);
    const [createModalVisible, setCreateModalVisible] = useState(false);

    const throwAsyncError = useAsyncError();

    const getHalls = () => {
        axiosAuthInstance
            .get(GET_HALLS_URL)
            .then((res) => setHalls(res.data))
            .catch((err) => {
                throwAsyncError(new Error());
            });
    };

    const deleteHall = () => {
        setDeleteStatus('pending');
        axiosAuthInstance
            .delete(DELETE_HALL_URL(deleteHallId!))
            .then((res) => {
                setDeleteStatus('success');
                getHalls();
            })
            .catch((err) => {
                setDeleteStatus('error');

                setDeleteError(
                    err.response && err.response.data
                        ? err.response.data
                        : 'Something went wrong. Please try again.'
                );
            });
    };

    useEffect(getHalls, []);

    useEffect(() => {
        console.log(deleteHallId);
    }, [deleteHallId]);

    return (
        <Fragment>
            <Helmet>
                <title>Manage halls | Projektor</title>
            </Helmet>
            <AddContainer>
                <Button onClick={() => setCreateModalVisible(true)}>
                    <FontAwesomeIcon icon={faPlus} /> New Hall
                </Button>
            </AddContainer>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">
                                <Title>ID</Title>
                            </TableCell>
                            <TableCell align="left">
                                <Title>Name</Title>
                            </TableCell>
                            <TableCell align="left">
                                <Title>Dimensions</Title>
                            </TableCell>
                            <TableCell align="left">
                                <Title>Actions</Title>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {halls.map((hall) => (
                            <TableRow
                                key={hall.id}
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
                                    {hall.id}
                                </TableCell>
                                <TableCell align="left">{hall.name}</TableCell>
                                <TableCell align="left">
                                    {hall.rows} rows x {hall.columns} columns
                                </TableCell>
                                <TableCell align="left" height={100}>
                                    <Button
                                        onClick={() => {
                                            setDeleteHallId(hall.id);
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
            {createModalVisible && (
                <CreateHall
                    onClose={() => setCreateModalVisible(false)}
                    onSuccess={getHalls}
                />
            )}
            {deleteHallId !== null && (
                <Modal show={true}>
                    <Modal.Header>
                        <Title>Delete hall {deleteHallId}</Title>
                    </Modal.Header>
                    <Modal.Body>
                        {deleteStatus === 'idle' && (
                            <p>
                                Are you sure you want to delete this hall? This
                                action cannot be undone.
                            </p>
                        )}
                        {deleteStatus === 'pending' && <p>Loading...</p>}
                        {deleteStatus === 'error' && <p>{deleteError}</p>}
                        {deleteStatus === 'success' && (
                            <p>Hall successfully deleted.</p>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            disabled={deleteStatus === 'pending'}
                            onClick={() => {
                                setDeleteHallId(null);
                                setDeleteStatus('idle');
                                setDeleteError(null);
                            }}
                        >
                            Close
                        </Button>
                        <Button
                            onClick={deleteHall}
                            disabled={
                                deleteStatus === 'pending' ||
                                deleteStatus === 'success'
                            }
                        >
                            Delete
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </Fragment>
    );
};

export default ManageHalls;

const AddContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
`;

const Title = styled.div`
    font-weight: bold;
`;
