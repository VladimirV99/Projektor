import { setTokensAndUser } from 'redux/auth/actions';
import { logoutFullfiled } from 'redux/auth/actions';
import axios from 'axios';
import store from 'redux/store';
import urlJoin from 'url-join';
import URL_BASE from 'constants/api/global';

const axiosAuthInstance = axios.create();

const REFRESH_SESSION_URL = urlJoin(URL_BASE, '/Authentication/RefreshSession');

const refreshSession = () => {
    const refreshToken = window.localStorage.getItem('refreshToken');
    const userEncoded = window.localStorage.getItem('user');
    const email = JSON.parse(userEncoded || '')?.email;

    return axios.post(REFRESH_SESSION_URL, { email, refreshToken });
};

axiosAuthInstance.interceptors.request.use(
    (config) => {
        if (config.headers && config.headers.Authorization) {
            return config;
        }
        if (!config.headers) {
            config.headers = {};
        }
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
            return Promise.reject(error);
        }
        const originalRequest = error.config;
        if (originalRequest._retry) {
            store.dispatch(logoutFullfiled());
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');

            return Promise.reject(error);
        }
        originalRequest._retry = true;
        return new Promise((resolve, reject) => {
            refreshSession()
                .then((response) => {
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
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    localStorage.removeItem('user');
                    store.dispatch(logoutFullfiled());
                    reject(error);
                });
        });
    }
);

export default axiosAuthInstance;
