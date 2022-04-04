import { Modal } from "@mui/material";

type Props = {
    children: JSX.Element;
    shouldRender: boolean;
    onModalClose: () => void;
}

const ModalCheKoV = ({ children, shouldRender, onModalClose }: Props): JSX.Element => {
    return (
        <Modal open={shouldRender} onBackdropClick={onModalClose}>
            {children}
        </Modal>
    );
}

export default ModalCheKoV;