import { Fragment } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from 'redux/auth/selectors';
import { userHasRole } from 'util/auth';

type Props = {
    children: JSX.Element | JSX.Element[];
    role: string;
};

export default function WithAuthorization({ role, children }: Props) {
    const user = useSelector(selectUser);
    return userHasRole(role) ? (
        <Fragment>{children}</Fragment>
    ) : (
        <Navigate to="/" />
    );
}
