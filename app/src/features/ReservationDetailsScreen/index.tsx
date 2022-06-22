import axios from 'axios';
import axiosAuthInstance from 'axios/instance';
import { GET_SCREENING_BY_ID } from 'constants/api';
import { GET_SEATS_FOR_SCREENING, CREATE_RESETVATION } from 'constants/api/reservations';
import Screening from 'models/Screening';
import Seat from 'models/Seat';
import { Fragment, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import Row from './Components/Row';

const ReservationDetailsScreen = () => {

    const { id: screeningId } = useParams();
    const [screening, setScreening] = useState<Screening | null>(null);
    const [seats, setSeats] = useState<Seat[][] | null>(null);

    const [selectedSeatMatrix, setSelectedSeatMatrix] = useState<boolean[][] | null>(null);

    const changeSelectedMatrix = (i: number, j: number) => {
        let newMatrix = selectedSeatMatrix;
        newMatrix![i][j] = !newMatrix![i][j];
        setSelectedSeatMatrix(newMatrix);
    }

    const formSelectedMatrix = (seats: Seat[][]) => {
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
        }).then(response => console.log(response.data))
           .catch(error => console.log(error))
    }

    if (screening === null) return <Fragment />;
    if (seats === null) return <Fragment />;

    return (
        <div style={{ margin: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between'}}>
                <div>Projektor {screening!.hall!.name}</div>
                <div>{new Date(screening.movieStart).toLocaleString()}</div>
            </div >
            <hr/>
            <div style={{display: 'flex'}}>
            {seats.map(((row, index) => <Row onClick={changeSelectedMatrix} row={row} rowIndex={index}/>))}
            </div>
            <button onClick={() => createReservation()}>Create reservation</button>
        </div>
    )
};

export default ReservationDetailsScreen;
