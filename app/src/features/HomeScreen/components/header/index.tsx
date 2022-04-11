import { Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { logoutCustomer } from "../../../authentication/redux/reducers";
import { selectUser } from "../../../authentication/redux/selectors";
import SignIn from "../../../authentication/signIn";
import SignUp from "../../../authentication/signUp";

type Props = {
    isUserLoggedIn?: boolean;
    shouldRenderSignInModal: boolean;
    shouldRenderSignUpModal: boolean;
    onSignInModalClose: () => void;
    onSignUpModalClose: () => void;
    onSignUpLinkCicked: () => void;
    openSignInModal: () => void;
    openSignUpModal: () => void;
}

const HomeScreenHeader = (
    {
        shouldRenderSignInModal,
        shouldRenderSignUpModal,
        onSignInModalClose,
        onSignUpModalClose,
        onSignUpLinkCicked,
        openSignInModal,
        openSignUpModal,
        isUserLoggedIn
    }: Props): JSX.Element => {

    const user = useSelector(selectUser);

    const dispatch = useDispatch();

    const onLogOut = () => {
        dispatch(logoutCustomer());
    }

    return isUserLoggedIn ? (
        <div style={{ display: 'flex', justifyContent: 'space-between'}}>
            <span>{user.firstName} {user.lastName}</span>
            <Button onClick={onLogOut}>Log out</Button>
        </div>
    ) : (
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <div>
                <Button onClick={openSignInModal}>Sign in</Button>
                <Button onClick={openSignUpModal}>Sign up</Button>
                <SignIn shouldRender={shouldRenderSignInModal} onModalClose={onSignInModalClose} onSignUpLinkClicked={onSignUpLinkCicked} />
                <SignUp shouldRender={shouldRenderSignUpModal} onModalClose={onSignUpModalClose} />
            </div>
        </div >
    )
}

export default HomeScreenHeader;