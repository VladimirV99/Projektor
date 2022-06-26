import SeatModel from 'models/Seat';
import Seat from '../Seat';

type Props = {
    row: SeatModel[];
    rowIndex: number;
    onClick: (i: number, j: number) => void;
};

const Row = ({ row, rowIndex, onClick }: Props) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'row' }}>
            {row.map((seat, index) => (
                <div style={{ margin: 5 }}>
                    <Seat
                        onSeatClick={onClick}
                        rowIndex={rowIndex}
                        columnIndex={index}
                        isReserved={seat.reserved}
                    />
                </div>
            ))}
        </div>
    );
};

export default Row;
