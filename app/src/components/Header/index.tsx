import { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsUserLoggedIn, selectUser } from 'redux/auth/selectors';
import { logoutCustomer } from 'redux/auth/actions';
import SignIn from 'features/authentication/SignIn';
import SignUp from 'features/authentication/SignUp';

const Header = (): JSX.Element => {
    const [signInModal, setSignInModal] = useState<boolean>(false);
    const [signUpModal, setSignUpModal] = useState<boolean>(false);

    const isUserLoggedIn = useSelector(selectIsUserLoggedIn);

    useEffect(() => {
        if (isUserLoggedIn) {
            setSignInModal(false);
            setSignUpModal(false);
        }
    }, [isUserLoggedIn]);

    const onSignUpLinkClicked = () => {
        setSignInModal(false);
        setSignUpModal(true);
    };

    const onSignInLinkClicked = () => {
        setSignInModal(true);
        setSignUpModal(false);
    };

    const user = useSelector(selectUser);

    const dispatch = useDispatch();

    const onLogOut = () => {
        dispatch(logoutCustomer());
    };

    return isUserLoggedIn && user ? (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>
                {user.firstName} {user.lastName}
            </span>
            <Button onClick={onLogOut}>Log out</Button>
        </div>
    ) : (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div>
                <Button onClick={onSignInLinkClicked}>Sign in</Button>
                <Button onClick={onSignUpLinkClicked}>Sign up</Button>
                <SignUp
                    shouldRender={signUpModal}
                    onModalClose={() => setSignUpModal(false)}
                />
                <SignIn
                    shouldRender={signInModal}
                    onModalClose={() => setSignInModal(false)}
                    onSignUpLinkClicked={onSignUpLinkClicked}
                />
            </div>
        </div>
    );
};

export default Header;
