import axiosAuthInstance from 'axios/instance';
import { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from 'redux/auth/selectors';
import {
    Paper,
    Table,
    TableContainer,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    IconButton,
    Button,
    Backdrop,
    CircularProgress,
} from '@mui/material';
import { Modal } from 'react-bootstrap';
import CancelIcon from '@mui/icons-material/Cancel';
import {
    CANCEL_RESERVATION,
    GET_USER_RESERVATIONS,
} from 'constants/api/reservations';
import Reservation from 'models/Reservation';

type Status = 'idle' | 'pending' | 'success' | 'error';

const MyReservationsScreen = (): JSX.Element => {
    const user = useSelector(selectUser);

    const [isLoading, setLoading] = useState<boolean>(true);
    const [reservations, setReservations] = useState<Reservation[]>([]);

    const [cancelReservationId, setCancelReservationId] = useState<
        number | null
    >(null);
    const [cancelStatus, setCancelStatus] = useState<Status>('idle');

    useEffect(() => {
        axiosAuthInstance
            .get<Reservation[]>(GET_USER_RESERVATIONS)
            .then((res) => {
                setReservations(res.data);
                setLoading(false);
            });
    }, []);

    const cancelReservation = () => {
        if (cancelReservationId === null) {
            return;
        }
        setCancelStatus('pending');
        axiosAuthInstance
            .delete(CANCEL_RESERVATION(cancelReservationId))
            .then(() => {
                setReservations(
                    reservations.filter((r) => r.id !== cancelReservationId)
                );
                setCancelStatus('success');
            })
            .catch((err) => {
                setCancelStatus('error');
            });
    };

    return (
        <div style={{ padding: '2rem' }}>
            {isLoading && (
                <Backdrop open={true}>
                    <CircularProgress />
                </Backdrop>
            )}
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell align="right">Movie</TableCell>
                            <TableCell align="right">Start Time</TableCell>
                            <TableCell align="right">Seats</TableCell>
                            <TableCell align="right">Price</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {reservations.map((reservation) => (
                            <TableRow
                                key={reservation.id}
                                sx={{
                                    '&:last-child td, &:last-child th': {
                                        border: 0,
                                    },
                                }}
                            >
                                <TableCell align="right">
                                    {reservation.movie.title}
                                </TableCell>
                                <TableCell align="right">
                                    {new Date(
                                        reservation.screening.movieStart
                                    ).toLocaleString()}
                                </TableCell>
                                <TableCell align="right">
                                    {reservation.seats
                                        .map((seat, i) => {
                                            return `${seat.row}/${seat.column}`;
                                        })
                                        .join(', ')}
                                </TableCell>
                                <TableCell align="right">
                                    {reservation.price.toFixed(0)} RSD
                                </TableCell>

                                <TableCell align="right">
                                    <IconButton
                                        color="error"
                                        aria-label="cancel reservation"
                                        onClick={() =>
                                            setCancelReservationId(
                                                reservation.id
                                            )
                                        }
                                    >
                                        <CancelIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                        {!isLoading && reservations.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5}>
                                    <h5
                                        style={{
                                            textAlign: 'center',
                                            margin: '1rem',
                                        }}
                                    >
                                        You don't currently have any
                                        reservations
                                    </h5>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <Modal show={cancelReservationId !== null}>
                <Modal.Header>
                    <Modal.Title>
                        Cancel reservation for{' '}
                        {reservations.find(
                            ({ id }) => id === cancelReservationId
                        )?.movie.title ?? ''}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {cancelStatus === 'idle' && (
                        <div>
                            Are you sure you want to cancel this reservation?
                            <br />
                            This action cannot be undone.
                        </div>
                    )}
                    {cancelStatus === 'pending' && <div>Please wait...</div>}
                    {cancelStatus === 'error' && (
                        <div>Something went wrong. Please try again.</div>
                    )}
                    {cancelStatus === 'success' && (
                        <div>Reservation successfully canceled</div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    {(cancelStatus === 'success' ||
                        cancelStatus === 'error') && (
                        <Button
                            onClick={() => {
                                setCancelReservationId(null);
                                setCancelStatus('idle');
                            }}
                        >
                            Close
                        </Button>
                    )}
                    {(cancelStatus === 'idle' ||
                        cancelStatus === 'pending') && (
                        <Fragment>
                            <Button
                                disabled={cancelStatus === 'pending'}
                                onClick={() => {
                                    setCancelReservationId(null);
                                    setCancelStatus('idle');
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={cancelReservation}
                                disabled={cancelStatus === 'pending'}
                            >
                                Delete
                            </Button>
                        </Fragment>
                    )}
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default MyReservationsScreen;
