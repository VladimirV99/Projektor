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
import Hall from 'models/Hall';
import { GET_HALLS_URL } from 'constants/api/reservations';
import CreateOrEditHall from '../CreateOrEditHall';

const ManageHalls = () => {
    const [halls, setHalls] = useState<Hall[]>([]);
    const [selectedHall, setSelectedHall] = useState<Hall | null>(null);
    const [deleteHallId, setDeleteHallId] = useState<number | null>(null);
    const [deleteStatus, setDeleteStatus] = useState<string | null>('idle');
    const [updateStatus, setUpdateStatus] = useState('idle');

    const throwAsyncError = useAsyncError();

    const deleteHall = () => {};

    const getHalls = () => {
        axiosAuthInstance
            .get(GET_HALLS_URL)
            .then((res) => setHalls(res.data))
            .catch((err) => {
                throwAsyncError(new Error());
            });
    };

    useEffect(getHalls, []);

    return (
        <Fragment>
            <Helmet>
                <title>Manage halls | Projektor</title>
            </Helmet>
            <AddContainer>
                <Button
                    onClick={() => {
                        setSelectedHall(new Hall(-1, ''));
                    }}
                >
                    <FontAwesomeIcon icon={faPlus} />
                    New Hall
                </Button>
            </AddContainer>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">ID</TableCell>
                            <TableCell align="left">Name</TableCell>
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
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {selectedHall && (
                <CreateOrEditHall
                    hall={selectedHall}
                    onClose={() => setSelectedHall(null)}
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
