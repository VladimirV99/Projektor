import { Button } from '@mui/material';
import Hall from 'models/Hall';
import { useState } from 'react';
import { Modal } from 'react-bootstrap';

type Props = {
    hall: Hall;
    onClose: () => void;
};

const CreateOrEditHall = ({ hall, onClose }: Props) => {
    const id = hall.id;
    const [status, setStatus] = useState('idle');
    const isCreate = id !== -1;

    return (
        <Modal show={true}>
            <Modal.Header>
                {isCreate ? 'Creating' : 'Updating'} a hall
            </Modal.Header>
            <Modal.Body></Modal.Body>
            <Modal.Footer>
                {status === 'idle' && (
                    <Button onClick={() => {}}>Submit</Button>
                )}
                {(status === 'success' || status === 'error') && (
                    <Button onClick={() => {}}>Close</Button>
                )}
            </Modal.Footer>
        </Modal>
    );
};

export default CreateOrEditHall;
