import { Fragment, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import styled from 'styled-components';
import { Button } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import axiosAuthInstance from 'axios/instance';
import useAsyncError from 'hooks/useAsyncError';
import { DELETE_HALL_URL, GET_HALLS_URL } from 'constants/api/reservations';
import CreateHall from '../CreateHall';
import { HallAdmin } from 'models/Hall';
import DeleteModal from 'components/DeleteModal';
import { Status } from 'constants/index';

const ManageHalls = () => {
    const [halls, setHalls] = useState<HallAdmin[]>([]);
    const [deleteHallId, setDeleteHallId] = useState<number | null>(null);
    const [deleteStatus, setDeleteStatus] = useState<Status>('idle');
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
                <DeleteModal
                    onSubmit={deleteHall}
                    onClose={() => {
                        setDeleteHallId(null);
                        setDeleteStatus('idle');
                        setDeleteError(null);
                    }}
                    title={`Delete hall: ${
                        halls.find(({ id }) => id === deleteHallId)?.name ?? ''
                    }`}
                    entityName="hall"
                    deleteStatus={deleteStatus}
                    errorMessage={deleteError}
                />
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
