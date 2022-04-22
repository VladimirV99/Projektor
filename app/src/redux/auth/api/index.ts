import axios, { Axios, AxiosPromise } from 'axios';
import {
    loginResponse,
    userLoginRequest,
    userRegisterRequest,
} from '../models';
import * as ENDPOINTS from 'constants/api';

export const createUser = ({
    firstName,
    lastName,
    password,
    email,
}: userRegisterRequest) =>
    axios.post(ENDPOINTS.REGISTER_URL, {
        firstName,
        lastName,
        password,
        email,
    });

export const loginUser = ({
    email,
    password,
}: userLoginRequest): AxiosPromise<loginResponse> => {
    console.log('Firing api request with', ENDPOINTS.LOGIN_URL);
    return axios.post(ENDPOINTS.LOGIN_URL, {
        email,
        password,
    });
};
