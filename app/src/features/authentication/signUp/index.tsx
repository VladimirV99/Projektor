import { useState } from 'react';
import { Formik } from 'formik';
import { Button } from '@mui/material';
import ModalCheKoV from '../../../components/Modal';
import * as TRANSLATIONS from '../translations';
import FormInput from '../../../components/FormInput';

type Props = {
  shouldRender: boolean;
  onModalClose: () => void;
};

const SignUp = ({ shouldRender, onModalClose }: Props) => {

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordConfirmed, setPasswordConfirmed] = useState<string>('');

  return (
    <ModalCheKoV shouldRender={shouldRender} onModalClose={onModalClose}>
      <div style={{ alignItems: "center", flexDirection: 'column', display: "flex" }}>
        <h1>{TRANSLATIONS.SIGN_UP_LABEL}</h1>
        <Formik
          initialValues={{ email: email, password: password, passwordConfirmed: passwordConfirmed }}
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
              <FormInput type="email" label={TRANSLATIONS.EMAIL_LABEL} onChange={(e) => setEmail(e.currentTarget.value)} value={email} />
              <FormInput type="password" label={TRANSLATIONS.PASSWORD_LABEL} onChange={(e) => setPassword(e.currentTarget.value)} value={password} />
              <FormInput type="password" label={TRANSLATIONS.CONFIRM_PASSWORD_LABEL} onChange={(e) => setPasswordConfirmed(e.currentTarget.value)} value={passwordConfirmed} />
              {/* TODO: Change disable when we get this value from selector */}
              <Button type='submit' disabled={false} onClick={() => handleSubmit()}>Submit</Button>
            </form>
          )}
        </Formik>
      </div>
    </ModalCheKoV>
  )
};

export default SignUp;