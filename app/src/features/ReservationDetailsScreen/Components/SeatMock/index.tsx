type Props = {
    color: string;
};

const SeatMock = ({ color }: Props) => {
    return (
        <button
            disabled
            style={{
                width: 50,
                height: 50,
                borderWidth: 1,
                borderColor: 'black',
                backgroundColor: color,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
            }}
        />
    );
};

export default SeatMock;
