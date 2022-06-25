import { BorderHorizontalRounded } from "@mui/icons-material";
import { useState } from "react";

type Props = {
    isReserved: boolean;
    rowIndex: number;
    columnIndex: number;
    onSeatClick: (i: number, j: number) => void;
}

const Seat = ({ isReserved, rowIndex, columnIndex, onSeatClick }: Props) => {

    const [isSelected, setIsSelected] = useState(false);

    const getBackgroundColor = () => {
        let backgroundColor = 'red';

        if (isSelected) {
            backgroundColor = 'yellow'
        } else if (!isReserved) {
            backgroundColor = 'green'
        }
        return backgroundColor;
    }

    const selectSeat = () => {
        if (isReserved) return;
        if (isSelected) {
            setIsSelected(false);
            return;
        }
        setIsSelected(true);
    }

    return (
        <button
            onClick={() => { selectSeat(); onSeatClick(rowIndex, columnIndex) }}
            disabled={isReserved}
            style={
                {
                    width: 50,
                    height: 50,
                    borderWidth: 1, 
                    borderColor: 'black', 
                    backgroundColor: getBackgroundColor(),
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                }
            } />
    )
};

export default Seat;
