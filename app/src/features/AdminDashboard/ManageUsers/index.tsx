import { Fragment, useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import styled from 'styled-components';
import AddIcon from '@mui/icons-material/Add';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { Modal } from 'react-bootstrap';
import User from 'models/User';
import {
    DELETE_USER_BY_EMAIL_URL,
    GET_CUSTOMERS_URL,
    GET_ADMINISTRATORS_URL,
    REVOKE_TOKENS_URL,
} from 'constants/api/user';
import { Button, Pagination, TextField } from '@mui/material';
import axiosAuthInstance from 'axios/instance';
import CreateUserRequest from 'models/User/CreateUserRequest';
import CreateNewUser from '../CreateNewUser';
import { useDispatch } from 'react-redux';
import { useDebounce } from 'use-debounce';
import { logoutCustomer } from 'redux/auth/modules';
import { ROLE_ADMINISTRATOR, ROLE_CUSTOMER } from 'constants/common';
import SomethingWentWrong from 'components/SomethingWentWrong';
import { selectUser } from 'redux/auth/selectors';
import { Navigate } from 'react-router-dom';
import PageTitle from 'components/PageTitle';

type ManageUsersProps = {
    role: string;
};

type FilterUsersRequest = {
    searchString: string;
    page: number;
    perPage: number;
};

const ManageUsers = ({ role }: ManageUsersProps) => {
    const fetchFunction = useMemo(() => {
        if (role === ROLE_CUSTOMER) {
            return GET_CUSTOMERS_URL;
        } else if (role === ROLE_ADMINISTRATOR) {
            return GET_ADMINISTRATORS_URL;
        }
    }, [role]);

    if (fetchFunction === undefined) {
        return <SomethingWentWrong />;
    }

    const currentUser = useSelector(selectUser);

    const [usersCount, setUsersCount] = useState<number>(0);
    const [users, setUsers] = useState<User[] | null>(null);

    const [userForCreation, setUserForCreation] =
        useState<CreateUserRequest | null>(null);
    const [deleteUserEmail, setDeleteUserEmail] = useState<string | null>(null);
    const [deleteStatus, setDeleteStatus] = useState('idle');
    const [shouldRefresh, setShouldRefresh] = useState(false);

    const [filterUsersRequest, setFilterUsersRequest] =
        useState<FilterUsersRequest>({
            searchString: '',
            page: 1,
            perPage: 10,
        });

    const [searchStringInput, setSearchStringInput] = useState(
        filterUsersRequest.searchString || ''
    );
    const [debouncedSearchString] = useDebounce(searchStringInput, 500);

    useEffect(() => {
        if (
            filterUsersRequest.searchString &&
            filterUsersRequest.searchString === debouncedSearchString
        ) {
            return;
        }
        setFilterUsersRequest({
            ...filterUsersRequest,
            searchString: debouncedSearchString,
            page: 1,
        });
    }, [debouncedSearchString]);

    const numberOfPages = useMemo(() => {
        return Math.ceil(usersCount / filterUsersRequest.perPage);
    }, [usersCount, filterUsersRequest.perPage]);

    const dispatch = useDispatch();

    const getUsers = () =>
        axiosAuthInstance
            .get(
                fetchFunction(
                    filterUsersRequest.searchString,
                    filterUsersRequest.page,
                    filterUsersRequest.perPage
                )
            )
            .then((response) => {
                setUsersCount(response.data.count);
                setUsers(response.data.users);
            });

    const deleteUser = () => {
        setDeleteStatus('pending');
        axiosAuthInstance
            .delete(DELETE_USER_BY_EMAIL_URL(deleteUserEmail!))
            .then((response) => {
                setShouldRefresh(true);
                setDeleteStatus('success');
            })
            .catch(() => setDeleteStatus('error'));
    };

    const revokeTokens = () => {
        axiosAuthInstance.post(REVOKE_TOKENS_URL).then((res) => {
            dispatch(logoutCustomer());
        });
    };

    useEffect(() => {
        getUsers();
    }, [filterUsersRequest]);

    useEffect(() => {
        if (shouldRefresh) {
            getUsers();
            setShouldRefresh(false);
        }
    });

    const renderPagination = () => (
        <Pagination
            count={numberOfPages}
            page={filterUsersRequest.page}
            onChange={(e, page) => {
                setFilterUsersRequest({
                    ...filterUsersRequest,
                    page,
                });
            }}
        />
    );

    return (
        <Fragment>
            <PageTitle title={`Manage ${role.toLowerCase()}s`} />

            <UserActionsContainer>
                <Button variant="outlined" color="error" onClick={revokeTokens}>
                    Revoke all tokens
                </Button>

                <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={() => {
                        setUserForCreation(new CreateUserRequest());
                    }}
                    style={
                        role !== ROLE_ADMINISTRATOR
                            ? { display: 'none' }
                            : undefined
                    }
                >
                    New administrator
                </Button>
            </UserActionsContainer>

            <SearchAndPaginationContainer>
                <TextField
                    value={searchStringInput ?? ''}
                    label={`Search ${role}s`}
                    onChange={(e) => {
                        setSearchStringInput(e.target.value);
                    }}
                />
                {renderPagination()}
            </SearchAndPaginationContainer>

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }}>
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
                        {users &&
                            users.map((user) => (
                                <TableRow
                                    key={user.id}
                                    sx={{
                                        '&:last-child td, &:last-child th': {
                                            border: 0,
                                        },
                                    }}
                                >
                                    <TableCell
                                        align="left"
                                        component="th"
                                        scope="row"
                                    >
                                        {user.id}
                                    </TableCell>
                                    <TableCell
                                        align="left"
                                        component="th"
                                        scope="row"
                                    >
                                        {user.firstName}
                                    </TableCell>
                                    <TableCell
                                        align="left"
                                        component="th"
                                        scope="row"
                                    >
                                        {user.lastName}
                                    </TableCell>
                                    <TableCell
                                        align="left"
                                        component="th"
                                        scope="row"
                                    >
                                        {user.email}
                                    </TableCell>
                                    <TableCell align="left" height={100}>
                                        {currentUser?.id !== user.id && (
                                            <Button
                                                onClick={() => {
                                                    setDeleteUserEmail(
                                                        user.email
                                                    );
                                                }}
                                            >
                                                <FontAwesomeIcon
                                                    icon={faTrash}
                                                />
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <PaginationContainer>{renderPagination()}</PaginationContainer>
            {userForCreation && (
                <CreateNewUser
                    user={userForCreation}
                    onClose={() => setUserForCreation(null)}
                    callback={() => setShouldRefresh(true)}
                />
            )}
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
    );
};

export default ManageUsers;

const UserActionsContainer = styled.div`
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    justify-content: space-between;
`;

const SearchAndPaginationContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin: 20px 0;
`;

const PaginationContainer = styled.div`
    padding-top: 20px;
    display: flex;
    justify-content: center;
`;
