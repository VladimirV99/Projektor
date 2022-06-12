import { useState } from 'react';
import { Formik } from 'formik';
import { Button } from '@mui/material';
import ModalCheKoV from 'components/Modal';
import FormInput from 'components/FormInput';
import * as TRANSLATIONS from 'translations';
import { useDispatch } from 'react-redux';
import { loginCustomer } from 'redux/auth/modules';

type Props = {
    shouldRender: boolean;
    onModalClose: () => void;
    onSignUpLinkClicked: () => void;
};

const SignIn = ({ shouldRender, onModalClose, onSignUpLinkClicked }: Props) => {
    const [email, setEmail] = useState<string>('admin@admin.com');
    const [password, setPassword] = useState<string>('Admin_123');

    const dispatch = useDispatch();

    const isSubmitting = email && password;

    const signUp = () => (
        <div>
            <span>
                {TRANSLATIONS.NOT_A_MEMBER_LABEL}{' '}
                {
                    <a style={{ color: 'blue' }} onClick={onSignUpLinkClicked}>
                        {TRANSLATIONS.SIGN_UP_LABEL}
                    </a>
                }
            </span>
        </div>
    );

    return (
        <ModalCheKoV shouldRender={shouldRender} onModalClose={onModalClose}>
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
                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                disabled={!isSubmitting}
                                style={{ marginTop: '1rem' }}
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
