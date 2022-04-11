import { useEffect, useState } from "react"

const useTokens = () => {

    const [accessToken, setAccessToken] = useState('');
    const [refreshToken, setRefreshToken] = useState('');

    useEffect(() => {
        window.addEventListener('storage', () => {
            // When local storage changes, dump the list to
            // the console.
            console.log("Jebem mu majku");
            console.log(window.localStorage.getItem('accessToken') || '');
          });
    });

    // useEffect(() => {
    //     window.onstorage = () => {
    //         setAccessToken(window.localStorage.getItem('accessToken') || '');
    //         setRefreshToken(window.localStorage.getItem('refreshToken') || '');
    //     }
    // }, [])
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