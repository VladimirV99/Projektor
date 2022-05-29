import { Fragment, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Modal } from 'react-bootstrap';
import User from 'models/User';
import { DELETE_USER_BY_EMAIL_URL, GET_ALL_USERS_URL, REVOKE_TOKENS_URL } from 'constants/api/user';
import { Button } from '@mui/material';
import axiosAuthInstance from 'axios/instance';
import CreateUserRequest from 'models/User/CreateUserRequest';
import CreateNewUser from '../CreateNewUser';
import { useDispatch } from 'react-redux';
import { logoutCustomer } from 'redux/auth/actions';

const ManageUsers = () => {
    
    const [users, setUsers] = useState<User[] | null>(null);
    const [userForCreation, setUserForCreation] = useState<CreateUserRequest | null>(null);
    const [deleteUserEmail, setDeleteUserEmail] = useState<string | null>(null);
    const [deleteStatus, setDeleteStatus] = useState('idle');
    const [shouldRefresh, setShouldRefresh] = useState(false);

    const dispatch = useDispatch();

    const getUsers = () => 
        axiosAuthInstance.get(GET_ALL_USERS_URL).then((response) => {
            setUsers(response.data);
        })

    const deleteUser = () => {
        setDeleteStatus('pending');
        axiosAuthInstance.delete(DELETE_USER_BY_EMAIL_URL(deleteUserEmail!))
        .then((response) => {
            setShouldRefresh(true);
            setDeleteStatus('success');
        }).catch(() =>
            setDeleteStatus('error')
        )
    }

    const revokeTokens = () =>{
        axiosAuthInstance.post(REVOKE_TOKENS_URL)
        .then(
            (res) => {
                dispatch(logoutCustomer());
            }
        );
    }

    useEffect(() => {
        getUsers();
    }, [])

    useEffect(() => {
        if(shouldRefresh) {
            getUsers();
            setShouldRefresh(false);
        }
    })

    if(users === null) return null;

    return (
        <Fragment>
            <Helmet>
                <title>Admin dashboard | Projektor</title>
            </Helmet>
            <AddUserContainer>
                <Button
                    onClick={() => {
                        setUserForCreation(new CreateUserRequest());
                    }}
                >
                    <FontAwesomeIcon icon={faPlus} />
                    New administrator
                </Button>
                <Button onClick={revokeTokens}>
                    Revoke all tokens
                </Button>
            </AddUserContainer>
            <TableContainer component={Paper}>
                <Table sx={{minWidth: 650}}>
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">ID</TableCell>
                            <TableCell align="left">First name</TableCell>
                            <TableCell align="left">Last name</TableCell>
                            <TableCell align="left">Email</TableCell>
                            <TableCell align="left">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow
                                key={user.id}
                                sx={{
                                    '&:last-child td, &:last-child th': {
                                        border: 0,
                                    },
                                }}
                            >
                                <TableCell align="left" component="th" scope="row">
                                    {user.id}
                                </TableCell>
                                <TableCell align="left" component="th" scope="row">
                                    {user.firstName}
                                </TableCell>
                                <TableCell align="left" component="th" scope="row">
                                    {user.lastName}
                                </TableCell>
                                <TableCell align="left" component="th" scope="row">
                                    {user.email}
                                </TableCell>
                                <TableCell align="left" height={100}>
                                    <Button
                                        onClick={() => {
                                            setDeleteUserEmail(user.email);
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {userForCreation && 
                <CreateNewUser
                    user={userForCreation}
                    onClose={() => setUserForCreation(null)}
                    onBackdropClick={() => setUserForCreation(null)}
                    callback={() => setShouldRefresh(true)}
                />
            }
            <Modal show={deleteUserEmail !== null}>
                <Modal.Header>
                    <Modal.Title>
                        Deleting administrator: {deleteUserEmail}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {deleteStatus === 'idle' && (
                        <div>
                            Are you sure you want to delete this user? This
                            action cannot be undone.
                        </div>
                    )}
                    {deleteStatus === 'pending' && <div>Please wait...</div>}
                    {deleteStatus === 'error' && (
                        <div>Something went wrong. Please try again.</div>
                    )}
                    {deleteStatus === 'success' && (
                        <div>User successfully deleted</div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    {(deleteStatus === 'success' ||
                        deleteStatus === 'error') && (
                        <Button
                            onClick={() => {
                                setDeleteUserEmail(null);
                                setDeleteStatus('idle');
                            }}
                        >
                            Close
                        </Button>
                    )}
                    {(deleteStatus === 'idle' ||
                        deleteStatus === 'pending') && (
                        <Fragment>
                            <Button
                                disabled={deleteStatus === 'pending'}
                                onClick={() => {
                                    setDeleteUserEmail(null);
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={deleteUser}
                                disabled={deleteStatus === 'pending'}
                            >
                                Delete
                            </Button>
                        </Fragment>
                    )}
                </Modal.Footer>
            </Modal>
        </Fragment>
    )
};  

export default ManageUsers;

const AddUserContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
`;