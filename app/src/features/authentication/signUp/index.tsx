import { useState } from 'react';
import { Formik } from 'formik';
import { Button } from '@mui/material';
import * as Yup from 'yup';
import ModalCheKoV from '../../../components/Modal';
import * as TRANSLATIONS from '../../../translations';
import FormInput from '../../../components/FormInput';
import { useDispatch } from 'react-redux';
import { registerCustomer } from '../../../redux/auth/modules';

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
  const [errors, setErrors] = useState({firstName: '', lastName: '', email: '', password: ''});

  const dispatch = useDispatch();

  const isSubmiting = email && password && passwordConfirmed;

  const validate = () => {
    if(password !== passwordConfirmed){
      setErrors({...errors, password: "Passwords do not match"});
    }

    return errors;
  }

  return (
    <ModalCheKoV shouldRender={shouldRender} onModalClose={onModalClose}>
      <div style={{ backgroundColor: "white" }}>
        <h1 style={{ textAlign: "center"}}>{TRANSLATIONS.SIGN_UP_LABEL}</h1>
        {errors.password && <span>{errors.password}</span>}
        <Formik
          validate={validate}
          initialValues={{ email: email, password: password, passwordConfirmed: passwordConfirmed }}
          onSubmit={async () => {
            dispatch(registerCustomer({email, password, firstName, lastName}));
          }}
        >
          {({
            handleSubmit,
          }) => (
            <form style={{ flexDirection: 'column', display: 'flex', width: "300px", justifyContent: 'center' }} onSubmit={handleSubmit}>
              <FormInput type="text" label={TRANSLATIONS.FIRST_NAME_LABEL} onChange={(e) => setFirstName(e.currentTarget.value)} value={firstName} />
              <FormInput type="text" label={TRANSLATIONS.LAST_NAME_LABEL} onChange={(e) => setLastName(e.currentTarget.value)} value={lastName} />
              <FormInput type="email" label={TRANSLATIONS.EMAIL_LABEL} onChange={(e) => setEmail(e.currentTarget.value)} value={email} />
              <FormInput type="password" label={TRANSLATIONS.PASSWORD_LABEL} onChange={(e) => setPassword(e.currentTarget.value)} value={password} />
              <FormInput type="password" label={TRANSLATIONS.CONFIRM_PASSWORD_LABEL} onChange={(e) => setPasswordConfirmed(e.currentTarget.value)} value={passwordConfirmed} />
              <Button type='submit' disabled={!isSubmiting}>Submit</Button>
            </form>
          )}
        </Formik>
      </div>
    </ModalCheKoV>
  )
};

export default SignUp;