import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectIsUserLoggedIn } from "../authentication/redux/selectors";
import HomeScreenHeader from "./components/header";

const HomeScreen = () => {

    const [signInModal, setSignInModal] = useState<boolean>(false);
    const [signUpModal, setSignUpModal] = useState<boolean>(false);

    const isUserLoggedIn = useSelector(selectIsUserLoggedIn);

    useEffect(() => {
        if(isUserLoggedIn){
            setSignInModal(false);
            setSignUpModal(false);
        }
    }, [isUserLoggedIn])

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
            isUserLoggedIn={isUserLoggedIn}
        />
    )
}

export default HomeScreen;