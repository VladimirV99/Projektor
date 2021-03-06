import {
    loginError,
    loginFullfiled,
    loginPending,
    logoutFullfiled,
    registerFailed,
    registerFulfilled,
    registerPending,
} from '../actions';
import * as API from '../api';
import { userLoginRequest, userRegisterRequest } from '../models';

export const loginCustomer = (user: userLoginRequest) => (dispatch: any) => {
    dispatch(loginPending());
    return API.loginUser(user)
        .then((response) => {
            localStorage.setItem('user', JSON.stringify(response.data.user));
            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('refreshToken', response.data.refreshToken);

            dispatch(loginFullfiled(response.data));
        })
        .catch((err) => {
            if (err.response.status === 401) {
                dispatch(loginError({ message: 'Invalid credentials' }));
            } else {
                dispatch(loginError({ message: 'Something went wrong' }));
            }
        });
};

export const logoutCustomer = () => (dispatch: any) => {
    API.logoutUser(localStorage.getItem('refreshToken')!).finally(() => {
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');

        dispatch(logoutFullfiled());
    });
};

export const registerCustomer =
    (user: userRegisterRequest) => (dispatch: any) => {
        dispatch(registerPending());
        return API.createUser(user)
            .then(() => {
                dispatch(registerFulfilled());
                dispatch(
                    loginCustomer({
                        email: user.email,
                        password: user.password,
                    })
                );
            })
            .catch((res) => {
                if (res.response.status === 400) {
                    dispatch(registerFailed(res.response.data.errors));
                } else {
                    dispatch(registerFailed(null));
                }
            });
    };
