import { useState, useMemo, useEffect, Fragment } from 'react';
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
    firstName: string[];
    lastName: string[];
    email: string[];
    password: string[];
    passwordConfirmed: string[];
};

const SignUp = ({ onModalClose }: Props) => {
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [passwordConfirmed, setPasswordConfirmed] = useState<string>('');

    const [errors, setErrors] = useState({
        firstName: [],
        lastName: [],
        email: [],
        password: [],
        passwordConfirmed: [],
    } as Validation);

    const hasError = useMemo(() => {
        return (
            errors.firstName.length > 0 ||
            errors.lastName.length > 0 ||
            errors.email.length > 0 ||
            errors.password.length > 0 ||
            errors.passwordConfirmed.length > 0
        );
    }, [errors]);

    const isFilled = useMemo(() => {
        return firstName && lastName && email && password && passwordConfirmed;
    }, [firstName, lastName, email, password, passwordConfirmed]);

    const apiStatus = useSelector(selectAuthStatus);
    const apiErrors = useSelector(selectAuthErrors);
    const dispatch = useDispatch();

    useEffect(() => {
        if (apiStatus === LoadingStatus.Failed && apiErrors !== null) {
            const newErrors = Object.keys(apiErrors).reduce(
                (acc: any, key: string) => {
                    acc[key.toLowerCase()] = apiErrors[key];
                    return acc;
                },
                {}
            );
            setErrors({ ...errors, ...(newErrors as Validation) });
        }
        setSubmitting(false);
    }, [apiStatus, apiErrors]);

    const [isSubmitting, setSubmitting] = useState<boolean>(false);

    const validate = () => {
        let errors: Validation = {
            firstName: [],
            lastName: [],
            email: [],
            password: [],
            passwordConfirmed: [],
        };
        let hasError = false;

        if (firstName.trim().length == 0) {
            errors.firstName.push(REQUIRED);
            hasError = true;
        }
        if (lastName.trim().length == 0) {
            errors.lastName.push(REQUIRED);
            hasError = true;
        }
        if (email.trim().length == 0) {
            errors.email.push(REQUIRED);
            hasError = true;
        } else if (
            !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
        ) {
            errors.email.push(INVALID_EMAIL);
            hasError = true;
        }
        if (password !== passwordConfirmed) {
            errors.passwordConfirmed.push(PASSWORDS_DONT_MATCH);
            hasError = true;
        }
        if (password.length < MIN_PASSWORD_LENGTH) {
            errors.password.push(PASSWORD_TOO_SHORT);
            hasError = true;
        }

        setErrors(errors);
        if (hasError) return errors;
    };

    const getErrorsElement = (errors: string[]): JSX.Element | undefined => {
        return errors.length > 0 ? (
            <Fragment>
                {errors.map((x, i) => (
                    <span
                        key={i}
                        style={{
                            display: 'block',
                        }}
                    >
                        {x}
                    </span>
                ))}
            </Fragment>
        ) : undefined;
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
                                        firstName: [],
                                    });
                                }}
                                value={firstName}
                                error={getErrorsElement(errors.firstName)}
                            />
                            <FormInput
                                type="text"
                                label={TRANSLATIONS.LAST_NAME_LABEL}
                                onChange={(e) => {
                                    setLastName(e.currentTarget.value);
                                    setErrors({
                                        ...errors,
                                        lastName: [],
                                    });
                                }}
                                value={lastName}
                                error={getErrorsElement(errors.lastName)}
                            />
                            <FormInput
                                type="text"
                                label={TRANSLATIONS.EMAIL_LABEL}
                                onChange={(e) => {
                                    setEmail(e.currentTarget.value);
                                    setErrors({
                                        ...errors,
                                        email: [],
                                    });
                                }}
                                value={email}
                                error={getErrorsElement(errors.email)}
                            />
                            <FormInput
                                type="password"
                                label={TRANSLATIONS.PASSWORD_LABEL}
                                onChange={(e) => {
                                    setPassword(e.currentTarget.value);
                                    setErrors({
                                        ...errors,
                                        password: [],
                                        passwordConfirmed: [],
                                    });
                                }}
                                value={password}
                                error={getErrorsElement(errors.password)}
                            />
                            <FormInput
                                type="password"
                                label={TRANSLATIONS.CONFIRM_PASSWORD_LABEL}
                                onChange={(e) => {
                                    setPasswordConfirmed(e.currentTarget.value);
                                    setErrors({
                                        ...errors,
                                        password: [],
                                        passwordConfirmed: [],
                                    });
                                }}
                                value={passwordConfirmed}
                                error={getErrorsElement(
                                    errors.passwordConfirmed
                                )}
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
