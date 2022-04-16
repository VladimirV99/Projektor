import { createAsyncThunk } from '@reduxjs/toolkit';
import * as API from '../api';
import { userLoginRequest, userRegisterRequest } from '../models';
import { registerFailed } from '../reducers';

export const registerCustomer = createAsyncThunk(
  `registerCustomer`,
  async (user: userRegisterRequest, { dispatch }) => {
      API.createUser(user)
      .then(() => dispatch(loginCustomer({email: user.email, password: user.password})))
      .catch((res) => {
        dispatch(registerFailed(res.response.data.errors));
      });
  },
);

export const loginCustomer = createAsyncThunk(
    `loginCustomer`,
    async (user: userLoginRequest) => {
        const response = await API.loginUser(user);
        window.localStorage.setItem('accessToken', response.data.accessToken);
        window.localStorage.setItem('refreshToken', response.data.refreshToken);
        window.localStorage.setItem('user', JSON.stringify(response.data.user));

        return response.data;
    },
  );