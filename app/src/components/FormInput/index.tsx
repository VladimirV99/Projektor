import { TextField } from '@mui/material';

type Props = {
    onChange: (event: any) => void;
    value: string;
    type: string;
    label: string;
    error?: string | undefined;
    required?: boolean;
};

const FormInput = ({
    onChange,
    type,
    value,
    label,
    error = undefined,
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
            error={error !== undefined}
            helperText={error}
        />
    );
};

export default FormInput;
