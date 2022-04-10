import { useEffect, useState } from "react"

const useTokens = () => {

    const [accessToken, setAccessToken] = useState('');
    const [refreshToken, setRefreshToken] = useState('');

    useEffect(() => {
        window.onstorage = () => {
            setAccessToken(window.localStorage.getItem('accessToken') || '');
            setRefreshToken(window.localStorage.getItem('refreshToken') || '');
        }
    }, [])
    console.log('-------------------------');
    console.log(accessToken);
    console.log('-------------------------');
    return {
        isLoggedIn: accessToken !== '' && refreshToken !== '',
        accessToken,
        refreshToken
    }
}

export default useTokens;