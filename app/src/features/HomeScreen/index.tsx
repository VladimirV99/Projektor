import { Button } from "@mui/material";
import { useState } from "react";
import SignIn from "../authentication/signIn";
import SignUp from "../authentication/signUp";

const HomeScreen = () => {

    const [signInModal, setSignInModal] = useState<boolean>(false);
    const [signUpModal, setSignUpModal] = useState<boolean>(false);

    const onSignUpLinkCicked = () => {
        setSignInModal(false);
        setSignUpModal(true);
    }

    const renderSignInModal = () => (
        <SignIn
            shouldRender={signInModal}
            onModalClose={() => setSignInModal(!signInModal)}
            onSignUpLinkClicked={onSignUpLinkCicked}
        />
    )

    const renderSignUpModal = () => (
        <SignUp shouldRender={signUpModal} onModalClose={() => setSignUpModal(!signUpModal)} />
    )

    return (
        <div>
            {signInModal && renderSignInModal()}
            {signUpModal && renderSignUpModal()}
            <div>...Under construction</div>
            <Button onClick={() => setSignInModal(true)}>Jebo te signIn dugme</Button>
            <Button onClick={() => setSignUpModal(true)}>Jebo te signUp dugme</Button>
        </div>
    )
}

export default HomeScreen;