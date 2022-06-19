import { useState, useMemo } from 'react';
import { Formik } from 'formik';
import { Alert, Button } from '@mui/material';
import ModalCheKoV from 'components/Modal';
import FormInput from 'components/FormInput';
import * as TRANSLATIONS from 'translations';
import { useDispatch, useSelector } from 'react-redux';
import { loginCustomer } from 'redux/auth/modules';
import { Link } from 'react-router-dom';
import { clearAuthErrors, openSignUpForm } from 'redux/auth/actions';
import { selectAuthErrors, selectAuthStatus } from 'redux/auth/selectors';
import { LoadingStatus } from 'constants/common';

type Props = {
    onModalClose: () => void;
};

const SignIn = ({ onModalClose }: Props) => {
    const [email, setEmail] = useState<string>('admin@admin.com');
    const [password, setPassword] = useState<string>('Admin_123');

    const dispatch = useDispatch();

    const isFilled = useMemo(() => {
        return email.trim().length > 0 && password.trim().length > 0;
    }, [email, password]);

    const apiStatus = useSelector(selectAuthStatus);
    const apiErrors = useSelector(selectAuthErrors);

    const signUp = () => (
        <div>
            <span>
                {TRANSLATIONS.NOT_A_MEMBER_LABEL}{' '}
                {
                    <Link to="#" onClick={() => dispatch(openSignUpForm(true))}>
                        {TRANSLATIONS.SIGN_UP_LABEL}
                    </Link>
                }
            </span>
        </div>
    );

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
                    {TRANSLATIONS.SIGN_IN_LABEL}
                </h1>
                <h3 style={{ textAlign: 'center' }}>{signUp()}</h3>
                <Formik
                    initialValues={{ email, password }}
                    onSubmit={() => {
                        dispatch(loginCustomer({ email, password }));
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
                                type="email"
                                label={TRANSLATIONS.EMAIL_LABEL}
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.currentTarget.value)
                                }
                            />
                            <FormInput
                                type="password"
                                label={TRANSLATIONS.PASSWORD_LABEL}
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.currentTarget.value)
                                }
                            />
                            {apiStatus === LoadingStatus.Failed && (
                                <Alert severity="error">
                                    {apiErrors.message}
                                </Alert>
                            )}
                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                disabled={
                                    !isFilled ||
                                    apiStatus === LoadingStatus.Initializing
                                }
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

export default SignIn;
