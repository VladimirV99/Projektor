import axios, { AxiosPromise } from 'axios';
import axiosAuthInstance from 'axios/instance';
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
    return axios.post(ENDPOINTS.LOGIN_URL, {
        email,
        password,
    });
};

export const logoutUser = (refreshToken: string): AxiosPromise<void> => {
    return axiosAuthInstance.post(ENDPOINTS.LOGOUT_URL, {
        refreshToken,
    });
};
