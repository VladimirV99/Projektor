import { Button, FormControl, Input, InputLabel } from "@mui/material";
import useTokens from "../../../../hooks/useTokens";
import SignIn from "../../../authentication/signIn";
import SignUp from "../../../authentication/signUp";

type Props = {
    isUserLogedIn?: boolean;
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
        openSignUpModal
    }: Props): JSX.Element => {

    const {isLoggedIn} = useTokens();

    return isLoggedIn ? (
        <div>
            <span>ljkdslkdlskd</span>
        </div>
    ): (
            <div style = {{ display: "flex", justifyContent: "flex-end" }}>
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