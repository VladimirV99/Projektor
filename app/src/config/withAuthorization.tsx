import { access } from 'fs/promises';
import { Fragment, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';

type Props = {
    children: JSX.Element | JSX.Element[];
    role: string;
};

export default function WithAuthorization({ role, children }: Props) {
    const dispatch = useDispatch();

    const accessToken = useMemo(
        () => window.localStorage.getItem('accessToken'),
        []
    );
    if (!accessToken) {
        return <Navigate to="/not-found" />;
    }

    const rolesEncoded = JSON.parse(window.atob(accessToken.split('.')[1]))[
        'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
    ];

    if (
        (Array.isArray(rolesEncoded) && !rolesEncoded.includes(role)) ||
        rolesEncoded !== role
    ) {
        return <Navigate to="/not-found" />;
    }

    return <Fragment>{children}</Fragment>;
}
