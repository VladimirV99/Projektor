import { createAsyncThunk } from '@reduxjs/toolkit';
import * as API from '../api';
import { userLoginRequest, userRegisterRequest } from '../models';

export const registerCustomer = createAsyncThunk(
  `registerCustomer`,
  async (user: userRegisterRequest) => {
      await API.createUser(user);
  },
);

export const loginCustomer = createAsyncThunk(
    `registerCustomer`,
    async (user: userLoginRequest) => {
        const response = await API.loginUser(user);
        window.localStorage.setItem('accessToken', response.data.accessToken);
        window.localStorage.setItem('refreshToken', response.data.refreshToken);
    },
  );