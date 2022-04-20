import { clearTokensAndUser, setTokensAndUser } from 'redux/auth/actions';
import axios from 'axios';
import store from 'redux/store';

const axiosAuthInstance = axios.create();

const refreshSession = () => {
    const refreshToken = window.localStorage.getItem('refreshToken');
    const userEncoded = window.localStorage.getItem('user');
    const email = JSON.parse(userEncoded || '')?.email;

    return axios.post(
        'http://localhost:5106/api/v1/Authentication/RefreshSession',
        { email, refreshToken }
    );
};

axiosAuthInstance.interceptors.request.use(
    (config) => {
        console.log('[request interceptor]: intercepting request');
        if (config.headers && config.headers.Authorization) {
            console.log(
                '[request interceptor]: found authorization header, skip'
            );
            return config;
        }
        if (!config.headers) {
            config.headers = {};
        }
        console.log('[request interceptor]: setting token');
        const token = localStorage.getItem('accessToken');
        config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => {
        Promise.reject(error);
    }
);

axiosAuthInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (
            !error.response ||
            error.response.status !== 401 ||
            !error.response.headers ||
            !error.response.headers['is-token-expired']
        ) {
            // Meaning the request was unauthorized or some other error occurred
            console.log('[response interceptor]: unauthorized, skip');
            return Promise.reject(error);
        }
        const originalRequest = error.config;
        if (originalRequest._retry) {
            // Already retried
            console.log('[response interceptor]: already retried, skip');
            store.dispatch(clearTokensAndUser());
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');

            return Promise.reject(error);
        }
        originalRequest._retry = true;
        console.log('[response interceptor]: refreshing session');
        return new Promise((resolve, reject) => {
            refreshSession()
                .then((response) => {
                    // Successfully refreshed, try again
                    console.log(
                        '[response interceptor]: refreshed, retrying original request'
                    );
                    localStorage.setItem(
                        'accessToken',
                        response.data.accessToken
                    );
                    localStorage.setItem(
                        'refreshToken',
                        response.data.refreshToken
                    );
                    localStorage.setItem(
                        'user',
                        JSON.stringify(response.data.user)
                    );
                    store.dispatch(setTokensAndUser(response.data));
                    const repeatedRequest = { ...originalRequest };
                    repeatedRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
                    resolve(axiosAuthInstance(repeatedRequest));
                })
                .catch((error) => {
                    // Failed to refresh token, just remove it
                    console.log(
                        '[response interceptor]: failed to refresh, clearing tokens'
                    );
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    localStorage.removeItem('user');
                    store.dispatch(clearTokensAndUser());
                    reject(error);
                });
        });
    }
);

export default axiosAuthInstance;
