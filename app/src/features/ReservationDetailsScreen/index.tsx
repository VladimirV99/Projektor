import { Button } from '@mui/material';
import axios from 'axios';
import axiosAuthInstance from 'axios/instance';
import { GET_SCREENING_BY_ID } from 'constants/api';
import { GET_SEATS_FOR_SCREENING, CREATE_RESETVATION } from 'constants/api/reservations';
import Screening from 'models/Screening';
import SeatModel from 'models/Seat';
import SeatMock from './Components/SeatMock'
import { Fragment, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import Row from './Components/Row';
import ModalCheKoV from 'components/Modal';

const ReservationDetailsScreen = () => {

    const { id: screeningId } = useParams();
    const [screening, setScreening] = useState<Screening | null>(null);
    const [seats, setSeats] = useState<SeatModel[][] | null>(null);
    const [isModalOpened, setIsModalOpened] = useState<boolean>(false);
    const [selectedSeatMatrix, setSelectedSeatMatrix] = useState<boolean[][] | null>(null);

    const changeSelectedMatrix = (i: number, j: number) => {
        let newMatrix = selectedSeatMatrix;
        newMatrix![i][j] = !newMatrix![i][j];
        setSelectedSeatMatrix(newMatrix);
    }

    const formSelectedMatrix = (seats: SeatModel[][]) => {
        const n = seats.length;
        const m = seats[0].length;
        let matrix = []

        for(let i = 0; i < n; i++){
            matrix.push(Array(m).fill(false))
        }
        return matrix
    }

    useEffect(() => {
        axios.get(GET_SCREENING_BY_ID(parseInt(screeningId!))).then(
            (response) => setScreening(response.data)
        )
    }, [])

    useEffect(() => {
        if (screening !== null) {
            axios.get(GET_SEATS_FOR_SCREENING(parseInt(screeningId!))).then(
                (response) => {
                    setSeats(response.data);
                    setSelectedSeatMatrix(formSelectedMatrix(response.data))
                }
            )
        }
    }, [screening])

    const showModal = () => {
        <div style={{width: '100%', height: '100%'}}>
            <ModalCheKoV shouldRender={true} onModalClose={() => window.location.reload()} >
                <div style={{ display: 'flex'}}>
                    <h1>{`You successfuly created reservation for ${screening?.movie?.title} on ${new Date(screening!.movieStart).toLocaleString()}.
                        We sent you an email with more information.`}</h1>
                </div>
            </ModalCheKoV>
        </div>
    }

    const createReservation = () => {
        const n = seats!.length;
        const m = seats![0].length;
        let result = [];
        for(let i = 0; i < n; i++){
            for(let j = 0; j < m; j++){
                if(selectedSeatMatrix![i][j]){
                    result.push({row: i, column: j})
                }
            }
        }

        axiosAuthInstance.post(CREATE_RESETVATION, {
            screeningId,
            seats: result 
        }).then(response => setIsModalOpened(true))
           .catch(error => console.log(error))
    }

    if (screening === null) return <Fragment />;
    if (seats === null) return <Fragment />;

    return (
        <Fragment>
            <ModalCheKoV shouldRender={isModalOpened} onModalClose={() => window.location.reload()} >
                <div style={{
                    backgroundColor: 'white',
                    display: 'flex',
                    flexDirection: 'column',
                    height: 'fit-content',
                    padding: '2rem',
                    margin: 'auto',
                    borderRadius: '5px',
                }}>
                    <h4>{`You successfuly created reservation for ${screening?.movie?.title} for ${new Date(screening!.movieStart).toLocaleString()}.
                        We sent you an email with more information.`}</h4>
                </div>
            </ModalCheKoV>
            <div style={{ margin: 24, height: '100%', width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between'}}>
                    <div>Projektor {screening!.hall!.name}</div>
                    <div>{new Date(screening.movieStart).toLocaleString()}</div>
                </div >
                <hr/>
                <div style={{ display: 'flex', justifyContent: 'center'}}>
                    <div>
                        {seats.map(((row, index) => {
                            return (<div><Row onClick={changeSelectedMatrix} row={row} rowIndex={index}/></div>)
                        }))}
                    </div>
                </div>
                <div style={{marginTop: 20}}>
                    <Button variant="contained" fullWidth onClick={() => createReservation()}>Create reservation</Button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', marginTop: 30}}>
                    <div style={{ marginRight: 30 }}>
                        <SeatMock color={'green'} />
                        <div>Free</div>
                    </div>
                    <div style={{ marginRight: 30}}>
                        <SeatMock color={'red'} />
                        <div>Reserved</div>
                    </div>
                    <div style={{ marginRight: 30}}>
                        <SeatMock color={'yellow'} />
                        <div>Selected</div>
                    </div>
                </div>
            </div>
        </Fragment>
    )
};

export default ReservationDetailsScreen;
