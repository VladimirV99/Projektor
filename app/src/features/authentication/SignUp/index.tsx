import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Formik } from 'formik';
import { Button } from '@mui/material';
import ModalCheKoV from 'components/Modal';
import FormInput from 'components/FormInput';
import { registerCustomer } from 'redux/auth/modules';
import { selectAuthErrors } from 'redux/auth/selectors';
import * as TRANSLATIONS from 'translations';
import * as CONST from 'constants/index';

type Props = {
    shouldRender: boolean;
    onModalClose: () => void;
};

const SignUp = ({ shouldRender, onModalClose }: Props) => {
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [passwordConfirmed, setPasswordConfirmed] = useState<string>('');
    const [errors, setErrors] = useState({ password: '' });

    const apiErrors = useSelector(selectAuthErrors);
    const dispatch = useDispatch();

    const isSubmitting =
        firstName && lastName && email && password && passwordConfirmed;

    const validate = () => {
        if (password !== passwordConfirmed) {
            setErrors({
                ...errors,
                password: TRANSLATIONS.PASSWORDS_DONT_MATCH,
            });
            return errors;
        }

        if (password.length < CONST.MIN_PASSWORD_LENGTH) {
            setErrors({ ...errors, password: TRANSLATIONS.PASSWORD_TOO_SHORT });
            return errors;
        }
    };

    return (
        <ModalCheKoV shouldRender={shouldRender} onModalClose={onModalClose}>
            <div style={{ backgroundColor: 'white' }}>
                <h1 style={{ textAlign: 'center' }}>
                    {TRANSLATIONS.SIGN_UP_LABEL}
                </h1>
                <div style={{ paddingBottom: '16px' }}>
                    {apiErrors && (
                        <span
                            style={{
                                color: 'red',
                                textAlign: 'center',
                                display: 'block',
                            }}
                        >
                            {apiErrors.Email[0]}
                        </span>
                    )}
                    {errors.password && (
                        <span
                            style={{
                                color: 'red',
                                textAlign: 'center',
                                display: 'block',
                            }}
                        >
                            {errors.password}
                        </span>
                    )}
                </div>
                <Formik
                    validate={validate}
                    initialValues={{ email, password, passwordConfirmed }}
                    onSubmit={async () => {
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
                                flexDirection: 'column',
                                display: 'flex',
                                width: '300px',
                                justifyContent: 'center',
                            }}
                            onSubmit={handleSubmit}
                        >
                            <FormInput
                                type="text"
                                label={TRANSLATIONS.FIRST_NAME_LABEL}
                                onChange={(e) =>
                                    setFirstName(e.currentTarget.value)
                                }
                                value={firstName}
                            />
                            <FormInput
                                type="text"
                                label={TRANSLATIONS.LAST_NAME_LABEL}
                                onChange={(e) =>
                                    setLastName(e.currentTarget.value)
                                }
                                value={lastName}
                            />
                            <FormInput
                                type="email"
                                label={TRANSLATIONS.EMAIL_LABEL}
                                onChange={(e) =>
                                    setEmail(e.currentTarget.value)
                                }
                                value={email}
                            />
                            <FormInput
                                type="password"
                                label={TRANSLATIONS.PASSWORD_LABEL}
                                onChange={(e) =>
                                    setPassword(e.currentTarget.value)
                                }
                                value={password}
                            />
                            <FormInput
                                type="password"
                                label={TRANSLATIONS.CONFIRM_PASSWORD_LABEL}
                                onChange={(e) =>
                                    setPasswordConfirmed(e.currentTarget.value)
                                }
                                value={passwordConfirmed}
                            />
                            <Button type="submit" disabled={!isSubmitting}>
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
