import { Button } from '@mui/material';
import axios from 'axios';
import axiosAuthInstance from 'axios/instance';
import { GET_SCREENING_BY_ID } from 'constants/api';
import {
    GET_SEATS_FOR_SCREENING,
    CREATE_RESETVATION,
} from 'constants/api/reservations';
import Screening from 'models/Screening';
import SeatModel from 'models/Seat';
import SeatMock from './Components/SeatMock';
import { Fragment, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Row from './Components/Row';
import ModalCheKoV from 'components/Modal';
import { MovieScreen } from './index.styles';
import { PRICE_BASE } from 'constants/common/index';
import { useSelector } from 'react-redux';
import { selectIsUserLoggedIn } from 'redux/auth/selectors';

const ReservationDetailsScreen = () => {
    const { id: screeningId } = useParams();
    const navigate = useNavigate();

    const [screening, setScreening] = useState<Screening | null>(null);
    const [seats, setSeats] = useState<SeatModel[][] | null>(null);
    const [isModalOpened, setIsModalOpened] = useState<boolean>(false);
    const [selectedSeatMatrix, setSelectedSeatMatrix] = useState<
        boolean[][] | null
    >(null);
    const [currentPrice, setCurrentPrice] = useState<number>(0);
    const [numberOfSelectedSeats, setNumberOfSelectedSeats] =
        useState<number>(0);

    const currentUser = useSelector(selectIsUserLoggedIn);

    const changeSelectedMatrix = (i: number, j: number) => {
        var newMatrix = selectedSeatMatrix!.map((arr) => arr.slice());
        newMatrix[i][j] = !newMatrix[i][j];
        setSelectedSeatMatrix(newMatrix);
        recalculatePrice(newMatrix);
    };

    const formSelectedMatrix = (seats: SeatModel[][]) => {
        const n = seats.length;
        const m = seats[0].length;

        return Array(n).fill(Array(m).fill(false));
    };

    const recalculatePrice = (matrix: boolean[][]) => {
        const n = seats!.length;
        const m = seats![0].length;
        let newPrice = 0;
        let numOfSelected = 0;

        for (let i = 0; i < n; i++) {
            for (let j = 0; j < m; j++) {
                if (matrix[i][j] && !seats![i][j].reserved) {
                    numOfSelected += 1;
                    newPrice += seats![i][j].priceMultiplier * PRICE_BASE;
                }
            }
        }

        setNumberOfSelectedSeats(numOfSelected);
        setCurrentPrice(newPrice);
    };

    useEffect(() => {
        axios
            .get(GET_SCREENING_BY_ID(parseInt(screeningId!)))
            .then((response) => setScreening(response.data));
    }, []);

    useEffect(() => {
        if (screening !== null) {
            axios
                .get(GET_SEATS_FOR_SCREENING(parseInt(screeningId!)))
                .then((response) => {
                    setSeats(response.data);
                    setSelectedSeatMatrix(formSelectedMatrix(response.data));
                });
        }
    }, [screening]);

    const createReservation = () => {
        const n = seats!.length;
        const m = seats![0].length;
        let result = [];
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < m; j++) {
                if (selectedSeatMatrix![i][j] && !seats![i][j].reserved) {
                    result.push({ row: i, column: j });
                }
            }
        }

        axiosAuthInstance
            .post(CREATE_RESETVATION, {
                screeningId,
                seats: result,
            })
            .then((response) => setIsModalOpened(true))
            .catch((error) => console.log(error));
    };

    if (screening === null) return <Fragment />;
    if (seats === null) return <Fragment />;

    return (
        <Fragment>
            <ModalCheKoV
                shouldRender={isModalOpened}
                onModalClose={() => navigate('/reservations')}
            >
                <div
                    style={{
                        backgroundColor: 'white',
                        display: 'flex',
                        flexDirection: 'column',
                        height: 'fit-content',
                        padding: '2rem',
                        margin: 'auto',
                        borderRadius: '5px',
                    }}
                >
                    <h4>{`You successfully created reservation for ${
                        screening?.movie?.title
                    } for ${new Date(screening!.movieStart).toLocaleString()}.
                        We sent you an email with more information.`}</h4>
                </div>
            </ModalCheKoV>
            <div style={{ margin: 24 }}>
                <div
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                    <h5>{screening!.hall!.name}</h5>
                    <h5>{screening!.movie?.title}</h5>
                    <h5>{new Date(screening.movieStart).toLocaleString()}</h5>
                </div>
                <hr />
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginBottom: 30,
                    }}
                >
                    <div style={{ flexDirection: 'column' }}>
                        <MovieScreen />
                    </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <div>
                        {seats.map((row, index) => {
                            return (
                                <div>
                                    <Row
                                        onClick={changeSelectedMatrix}
                                        row={row}
                                        rowIndex={index}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div>
                    <h2>Current price: {currentPrice}</h2>
                </div>
                {!currentUser && numberOfSelectedSeats > 0 &&(
                    <div>
                        <h3>You must be logged in to create reservations</h3>    
                    </div>
                )}
                <div style={{ marginTop: 20 }}>
                    <Button
                        disabled={numberOfSelectedSeats === 0}
                        variant="contained"
                        fullWidth
                        onClick={() => createReservation()}
                    >
                        Create reservation
                    </Button>
                </div>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        marginTop: 30,
                    }}
                >
                    <div style={{ marginRight: 30 }}>
                        <SeatMock color={'green'} />
                        <div>Free</div>
                    </div>
                    <div style={{ marginRight: 30 }}>
                        <SeatMock color={'red'} />
                        <div>Reserved</div>
                    </div>
                    <div style={{ marginRight: 30 }}>
                        <SeatMock color={'yellow'} />
                        <div>Selected</div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default ReservationDetailsScreen;
