import { useState } from "react";
import HomeScreenHeader from "./components/header";

const HomeScreen = () => {

    const [signInModal, setSignInModal] = useState<boolean>(false);
    const [signUpModal, setSignUpModal] = useState<boolean>(false);

    const onSignUpLinkCicked = () => {
        setSignInModal(false);
        setSignUpModal(true);
    }

    return (
        <HomeScreenHeader
            shouldRenderSignInModal={signInModal} 
            shouldRenderSignUpModal={signUpModal} 
            onSignInModalClose={() => setSignInModal(!signInModal)}
            onSignUpModalClose={() => setSignUpModal(!signUpModal)}
            onSignUpLinkCicked={onSignUpLinkCicked}
            openSignInModal={() => setSignInModal(true)}
            openSignUpModal={() => setSignUpModal(true)}
        />
    )
}

export default HomeScreen;