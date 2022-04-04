import { useState } from 'react';
import { Formik } from 'formik';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import ModalCheKoV from '../../../components/Modal';
import FormInput from '../../../components/FormInput';
import * as TRANSLATIONS from '../translations';

type Props = {
  shouldRender: boolean;
  onModalClose: () => void;
  onSignUpLinkClicked: () => void;
};


const SignIn = ({ shouldRender, onModalClose, onSignUpLinkClicked }: Props) => {

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const signUp = () => (
    <div>
      <span>{TRANSLATIONS.NOT_A_MEMBER_LABEL} {<Link to="/" onClick={onSignUpLinkClicked}>
        {TRANSLATIONS.SIGN_UP_LABEL}</Link>}
      </span>
    </div>
  )

  return (
    <ModalCheKoV shouldRender={shouldRender} onModalClose={onModalClose}>
      <div style={{ alignItems: "center", flexDirection: 'column', display: "flex" }}>
        <h1>{TRANSLATIONS.SIGN_IN_LABEL}</h1>
        <h3>{signUp()}</h3>
        <Formik
          initialValues={{ email: email, password: password }}
          onSubmit={(values, { setSubmitting }) => {
            setTimeout(() => {
              alert(JSON.stringify(values, null, 2));
              setSubmitting(false);
            }, 400);
          }}
        >
          {({
            handleSubmit,
          }) => (
            <form style={{ flexDirection: 'column', display: 'flex', width: "300px" }} onSubmit={handleSubmit}>
              <FormInput type='email' label={TRANSLATIONS.EMAIL_LABEL} value={email} onChange={(e) => setEmail(e.currentTarget.value)} />
              <FormInput type='password' label={TRANSLATIONS.PASSWORD_LABEL} value={password} onChange={(e) => setPassword(e.currentTarget.value)} />
              {/* TODO: Change disable when we get this value from selector */}
              <Button
                type='submit'
                disabled={false}
                onClick={
                  () => {
                    handleSubmit();
                    console.log(email)
                  }
                }>{TRANSLATIONS.SUBMIT_LABEL}</Button>
            </form>
          )}
        </Formik>
      </div>
    </ModalCheKoV>
  )
};

export default SignIn;