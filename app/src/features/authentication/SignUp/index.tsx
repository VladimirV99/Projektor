import { useState, useMemo, useEffect } from 'react';
import { Formik } from 'formik';
import { Alert, Button } from '@mui/material';
import ModalCheKoV from 'components/Modal';
import * as TRANSLATIONS from 'translations';
import FormInput from 'components/FormInput';
import { useDispatch, useSelector } from 'react-redux';
import { registerCustomer } from 'redux/auth/modules';
import { LoadingStatus, MIN_PASSWORD_LENGTH } from 'constants/index';
import { selectAuthErrors, selectAuthStatus } from 'redux/auth/selectors';
import {
    REQUIRED,
    INVALID_EMAIL,
    PASSWORDS_DONT_MATCH,
    PASSWORD_TOO_SHORT,
} from 'translations';
import { clearAuthErrors } from 'redux/auth/actions';

type Props = {
    onModalClose: () => void;
};

type Validation = {
    firstName: string | undefined;
    lastName: string | undefined;
    email: string | undefined;
    password: string | undefined;
    passwordConfirmed: string | undefined;
};

const SignUp = ({ onModalClose }: Props) => {
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [passwordConfirmed, setPasswordConfirmed] = useState<string>('');

    const [errors, setErrors] = useState({
        firstName: undefined,
        lastName: undefined,
        email: undefined,
        password: undefined,
        passwordConfirmed: undefined,
    } as Validation);

    const hasError = useMemo(() => {
        return (
            errors.firstName !== undefined ||
            errors.lastName !== undefined ||
            errors.email !== undefined ||
            errors.password !== undefined ||
            errors.passwordConfirmed !== undefined
        );
    }, [errors]);

    const isFilled = useMemo(() => {
        return firstName && lastName && email && password && passwordConfirmed;
    }, [firstName, lastName, email, password, passwordConfirmed]);

    const apiStatus = useSelector(selectAuthStatus);
    const apiErrors = useSelector(selectAuthErrors);
    const dispatch = useDispatch();

    useEffect(() => {
        if (apiStatus === LoadingStatus.Failed && apiErrors !== null)
            setErrors({ ...errors, ...(apiErrors as Validation) });
        setSubmitting(false);
    }, [apiStatus, apiErrors]);

    const [isSubmitting, setSubmitting] = useState<boolean>(false);

    const validate = () => {
        let errors: Validation = {
            firstName: undefined,
            lastName: undefined,
            email: undefined,
            password: undefined,
            passwordConfirmed: undefined,
        };
        let hasError = false;

        if (firstName.trim().length == 0) {
            errors.firstName = REQUIRED;
            hasError = true;
        }
        if (lastName.trim().length == 0) {
            errors.lastName = REQUIRED;
            hasError = true;
        }
        if (email.trim().length == 0) {
            errors.email = REQUIRED;
            hasError = true;
        } else if (
            !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
        ) {
            errors.email = INVALID_EMAIL;
            hasError = true;
        }
        if (password !== passwordConfirmed) {
            errors.passwordConfirmed = PASSWORDS_DONT_MATCH;
            hasError = true;
        }
        if (password.length < MIN_PASSWORD_LENGTH) {
            errors.password = PASSWORD_TOO_SHORT;
            hasError = true;
        }

        setErrors(errors);
        if (hasError) return errors;
    };

    return (
        <ModalCheKoV
            shouldRender={true}
            onModalClose={() => {
                onModalClose();
                dispatch(clearAuthErrors());
            }}
        >
            <div
                style={{
                    backgroundColor: 'white',
                    display: 'flex',
                    flexDirection: 'column',
                    height: 'fit-content',
                    padding: '2rem',
                    margin: 'auto',
                    borderRadius: '5px',
                }}
            >
                <h1 style={{ textAlign: 'center' }}>
                    {TRANSLATIONS.SIGN_UP_LABEL}
                </h1>
                <Formik
                    validate={validate}
                    initialValues={{ email, password, passwordConfirmed }}
                    onSubmit={async () => {
                        setSubmitting(true);
                        dispatch(
                            registerCustomer({
                                email,
                                password,
                                firstName,
                                lastName,
                            })
                        );
                    }}
                >
                    {({ handleSubmit }) => (
                        <form
                            style={{
                                width: '350px',
                            }}
                            onSubmit={handleSubmit}
                        >
                            <FormInput
                                type="text"
                                label={TRANSLATIONS.FIRST_NAME_LABEL}
                                onChange={(e) => {
                                    setFirstName(e.currentTarget.value);
                                    setErrors({
                                        ...errors,
                                        firstName: undefined,
                                    });
                                }}
                                value={firstName}
                                error={errors.firstName}
                            />
                            <FormInput
                                type="text"
                                label={TRANSLATIONS.LAST_NAME_LABEL}
                                onChange={(e) => {
                                    setLastName(e.currentTarget.value);
                                    setErrors({
                                        ...errors,
                                        lastName: undefined,
                                    });
                                }}
                                value={lastName}
                                error={errors.lastName}
                            />
                            <FormInput
                                type="text"
                                label={TRANSLATIONS.EMAIL_LABEL}
                                onChange={(e) => {
                                    setEmail(e.currentTarget.value);
                                    setErrors({
                                        ...errors,
                                        email: undefined,
                                    });
                                }}
                                value={email}
                                error={errors.email}
                            />
                            <FormInput
                                type="password"
                                label={TRANSLATIONS.PASSWORD_LABEL}
                                onChange={(e) => {
                                    setPassword(e.currentTarget.value);
                                    setErrors({
                                        ...errors,
                                        password: undefined,
                                        passwordConfirmed: undefined,
                                    });
                                }}
                                value={password}
                                error={errors.password}
                            />
                            <FormInput
                                type="password"
                                label={TRANSLATIONS.CONFIRM_PASSWORD_LABEL}
                                onChange={(e) => {
                                    setPasswordConfirmed(e.currentTarget.value);
                                    setErrors({
                                        ...errors,
                                        password: undefined,
                                        passwordConfirmed: undefined,
                                    });
                                }}
                                value={passwordConfirmed}
                                error={errors.passwordConfirmed}
                            />
                            {apiStatus === LoadingStatus.Failed &&
                                apiErrors === null && (
                                    <Alert severity="error">
                                        Something went wrong
                                    </Alert>
                                )}
                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                disabled={isSubmitting || !isFilled || hasError}
                            >
                                {TRANSLATIONS.SUBMIT_LABEL}
                            </Button>
                        </form>
                    )}
                </Formik>
            </div>
        </ModalCheKoV>
    );
};

export default SignUp;
