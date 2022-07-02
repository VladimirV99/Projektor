import { useCallback, useMemo } from 'react';
import { Button, Modal } from 'react-bootstrap';

type Props = {
    onClose: () => void;
    onSubmit: () => void;
    title: string | null;
    deleteStatus: 'idle' | 'pending' | 'success' | 'error';
    errorMessage: string | null;
    entityName: string;
};

const DeleteModal = ({
    onClose,
    onSubmit,
    title,
    entityName,
    deleteStatus,
    errorMessage,
}: Props) => {
    const capitalize = useCallback(
        (message: string) => message.charAt(0).toUpperCase() + message.slice(1),
        []
    );

    const modalTitle = useMemo(() => title ?? `Delete this ${entityName}?`, []);

    const areYouSureMessage = useMemo(
        () =>
            `Are you sure want to delete this ${entityName}? This action cannot be undone.`,
        [entityName]
    );

    const successMessage = useMemo(
        () => `${capitalize(entityName)} successfully deleted.`,
        []
    );

    return (
        <Modal show={true}>
            <Modal.Header>{modalTitle}</Modal.Header>
            <Modal.Body>
                <p>
                    {deleteStatus === 'idle' && areYouSureMessage}
                    {deleteStatus === 'pending' && 'Loading...'}
                    {deleteStatus === 'error' &&
                        (errorMessage ??
                            'Something went wrong. Please try again later.')}
                    {deleteStatus === 'success' && successMessage}
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button disabled={deleteStatus === 'pending'} onClick={onClose}>
                    Close
                </Button>
                <Button
                    disabled={
                        deleteStatus === 'pending' || deleteStatus === 'success'
                    }
                    onClick={onSubmit}
                >
                    {Delete}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default DeleteModal;
