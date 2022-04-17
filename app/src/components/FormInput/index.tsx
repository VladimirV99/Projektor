import { FormControl, Input, InputLabel } from "@mui/material";

type Props = {
    onChange: (event: any) => void;
    value: string;
    type: string;
    label: string;
    required?: boolean;
}

const FormInput = ({ onChange, type, value, label, required = true }: Props): JSX.Element => {
    return (
        <FormControl style={{ paddingBottom: "20px" }}>
            <InputLabel>{label}</InputLabel>
            <Input
                required={required}
                type={type}
                onChange={onChange}
                value={value}
                style={{paddingLeft: '16px'}}
            />
        </FormControl>
    );
}

export default FormInput;