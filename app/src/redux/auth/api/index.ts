import axios, { Axios, AxiosPromise } from 'axios';
import { URL_PREFIX } from '../../../constants';
import { loginResponse, userLoginRequest, userRegisterRequest } from '../models';

const registerUrl = `${URL_PREFIX}/api/v1/Authentication/RegisterCustomer`;
const loginUrl = `${URL_PREFIX}/api/v1/Authentication/Login`;

export const createUser = ({
  firstName,
  lastName,
  password,
  email
} : userRegisterRequest
) =>
  axios.post(registerUrl, {
        firstName,
        lastName,
        password,
        email
  });

export const loginUser = ({
  email, 
  password
}: userLoginRequest) : AxiosPromise<loginResponse> => 
  axios.post(loginUrl, {
    email,
    password
  });