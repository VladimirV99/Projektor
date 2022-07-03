import { TextField } from '@mui/material';

type Props = {
    onChange: (event: any) => void;
    value: string;
    type: string;
    label: string;
    error?: JSX.Element | string | undefined;
    required?: boolean;
    multiline?: boolean;
};

const FormInput = ({
    onChange,
    type,
    value,
    label,
    error = undefined,
    required = true,
    multiline = false,
}: Props): JSX.Element => {
    return (
        <TextField
            multiline={multiline}
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
