import { clearTokensAndUser, setTokensAndUser } from 'redux/auth/actions'
import axios from 'axios'
import store from 'redux/store'

const axiosAuthInstance = axios.create()

const refreshSession = () => {
    const refreshToken = window.localStorage.getItem('refreshToken')
    const userEncoded = window.localStorage.getItem('user')
    const email = JSON.parse(userEncoded || '')?.email

    return axios.get(
        'http://localhost:5106/api/v1/Authentication/RefreshSession',
        { params: { email, refreshToken } }
    )
}

axiosAuthInstance.interceptors.request.use(
    (config) => {
        if (config.headers && config.headers.Authorization) {
            return
        }
        if (!config.headers) {
            config.headers = {}
        }
        const token = localStorage.getItem('accessToken')
        config.headers.Authorization = `Bearer ${token}`
        return config
    },
    (error) => {
        Promise.reject(error)
    }
)

axiosAuthInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        const originalRequest = error.config
        if (!error.response.headers.is_token_expired) {
            // Meaning the request was not unauthorized or some other error occurred
            return Promise.reject(error)
        }
        if (originalRequest._retry) {
            // Already retried
            store.dispatch(clearTokensAndUser())
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')

            return Promise.reject(error)
        }
        originalRequest._retry = true
        refreshSession()
            .then((response) => {
                // Successfully refreshed, try again
                localStorage.setItem('accessToken', response.data.accessToken)
                localStorage.setItem('refreshToken', response.data.refreshToken)
                localStorage.setItem('user', JSON.stringify(response.data.user))
                store.dispatch(setTokensAndUser(response.data))
                return axiosAuthInstance(originalRequest)
            })
            .catch((error) => {
                // Failed to refresh token, just remove it
                localStorage.removeItem('accessToken')
                localStorage.removeItem('refreshToken')
                localStorage.removeItem('user')
                store.dispatch(clearTokensAndUser)
                return Promise.reject(error)
            })
    }
)

export default axiosAuthInstance
