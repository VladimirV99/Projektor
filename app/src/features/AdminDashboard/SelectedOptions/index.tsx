import styled from '@emotion/styled';
import Chip from '@mui/material/Chip/Chip';

type Props = {
    options: { id: any; label: string }[];
    onDelete: (id: any) => void;
};

const SelectedOptions = ({ options, onDelete }: Props) => (
    <ChipContainer>
        {options.map(({ id, label }) => (
            <ChipWrapper>
                <Chip key={id} label={label} onDelete={() => onDelete(id)} />
            </ChipWrapper>
        ))}
    </ChipContainer>
);

export default SelectedOptions;

const ChipContainer = styled.div`
    display: flex;
    flex-direction: row;
`;

const ChipWrapper = styled.div`
    padding-right: 10px;
`;
