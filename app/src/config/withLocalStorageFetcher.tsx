import { Fragment, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { clearTokensAndUser, setTokensAndUser } from 'redux/auth/actions';

export default function WithLocalStorageFetcher({
    children,
}: {
    children: JSX.Element | JSX.Element[];
}) {
    const dispatch = useDispatch();
    //fetch data from localStorage and dispatch action to store
    useEffect(() => {
        const accessToken = window.localStorage.getItem('accessToken');
        const refreshToken = window.localStorage.getItem('refreshToken');
        const userEncoded = window.localStorage.getItem('user');

        if (!accessToken || !refreshToken || !userEncoded) {
            dispatch(clearTokensAndUser());
            return;
        }

        const user = JSON.parse(userEncoded);

        dispatch(setTokensAndUser({ accessToken, refreshToken, user }));
    }, []);

    return <Fragment>{children}</Fragment>;
}
