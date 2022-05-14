import styled from '@emotion/styled';
import Chip from '@mui/material/Chip/Chip';
import { css } from 'styled-components';

type Props = {
    options: { id: any; label: string }[];
    onDelete: (id: any) => void;
    direction: 'row' | 'column';
};

const SelectedOptions = ({ options, onDelete, direction }: Props) => (
    <div
        style={{ display: 'flex', flexDirection: direction, flexWrap: 'wrap' }}
    >
        {options.map(({ id, label }) => (
            <div
                style={{
                    paddingRight: direction === 'row' ? '10px' : '3px',
                    paddingBottom: direction === 'column' ? '10px' : '3px',
                }}
            >
                <Chip key={id} label={label} onDelete={() => onDelete(id)} />
            </div>
        ))}
    </div>
);

export default SelectedOptions;
