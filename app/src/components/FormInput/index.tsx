import { TextField } from '@mui/material';

type Props = {
    onChange: (event: any) => void;
    value: string;
    type: string;
    label: string;
    required?: boolean;
};

const FormInput = ({
    onChange,
    type,
    value,
    label,
    required = true,
}: Props): JSX.Element => {
    return (
        <TextField
            type={type}
            variant="standard"
            fullWidth
            margin="normal"
            label={label}
            required={required}
            onChange={onChange}
            value={value}
        />
    );
};

export default FormInput;
