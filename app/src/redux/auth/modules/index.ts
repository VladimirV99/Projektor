import {
    loginError,
    loginFullfiled,
    loginPending,
    logoutFullfiled,
    registerFailed,
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
        .catch((error) => {
            dispatch(loginError());
        });
};

export const logoutCustomer = () => (dispatch: any) => {
    API.logoutUser(localStorage.getItem('refreshToken')!)
        .then((response: any) => {
            localStorage.removeItem('user');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');

            dispatch(logoutFullfiled());
        })
}

export const registerCustomer =
    (user: userRegisterRequest) => (dispatch: any) => {
        return API.createUser(user)
            .then(() => {
                dispatch(
                    loginCustomer({
                        email: user.email,
                        password: user.password,
                    })
                );
            })
            .catch((res) => {
                dispatch(registerFailed(res.response.data.errors));
            });
    };
