import { access } from 'fs/promises';
import { Fragment, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { isUserAdmin } from 'util/auth';

type Props = {
    children: JSX.Element | JSX.Element[];
    role: string;
};

export default function WithAuthorization({ role, children }: Props) {
    return isUserAdmin() ? (
        <Fragment>{children}</Fragment>
    ) : (
        <Navigate to="/login" />
    );
}
