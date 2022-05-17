import { Fragment, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsUserLoggedIn, selectUser } from 'redux/auth/selectors';
import Helmet from 'react-helmet';
import { Col, Row } from 'react-bootstrap';
import { HideAt } from 'react-with-breakpoints';
import { Alert, Button, Divider, TextField } from '@mui/material';
import {
    ChangeUserNameRequest,
    ChangeUserNameErrors,
    ChangePasswordRequest,
    ChangePasswordErrors,
    RequestState,
} from './types';
import axiosAuthInstance from 'axios/instance';
import { UPDATE_NAME, UPDATE_PASSWORD } from 'constants/api';
import { updateName } from 'redux/auth/actions';
import * as E from 'constants/errors';
import * as F from 'constants/forms';

const getErrorsFromResponse = (errors: any) => {
    if (!errors.response) {
        return [E.SOMETHING_WENT_WRONG];
    }

    const allErrors: any = [];

    Object.values(errors.response.data.errors)
        .map((e) => (Array.isArray(e) ? e : null))
        .filter((e) => e !== null)
        .forEach((e) => {
            e?.forEach((ee) => allErrors.push(ee));
        });

    return allErrors;
};

const UserProfileSettings = () => {
    const isLoggedIn = useSelector(selectIsUserLoggedIn);
    const user = useSelector(selectUser);
    const firstName = user?.firstName ?? '';
    const lastName = user?.lastName ?? '';

    const dispatch = useDispatch();

    const [changeUserNameRequest, setChangeUserNameRequest] =
        useState<ChangeUserNameRequest>({
            firstName,
            lastName,
        });

    const [changePasswordRequest, setChangePasswordRequest] =
        useState<ChangePasswordRequest>({
            oldPassword: '',
            newPassword: '',
            repeatNewPassword: '',
        });

    useEffect(() => {
        setChangeUserNameRequest({
            firstName,
            lastName,
        });
    }, [user]);

    const nameValidationErrors = useMemo<ChangeUserNameErrors>(() => {
        const errors: ChangeUserNameErrors = {
            firstName: undefined,
            lastName: undefined,
        };
        if (changeUserNameRequest.firstName.trim().length === 0) {
            errors.firstName = E.FIRST_NAME_REQUIRED;
        }
        if (changeUserNameRequest.lastName.trim().length === 0) {
            errors.lastName = E.LAST_NAME_REQUIRED;
        }
        return errors;
    }, [changeUserNameRequest]);

    const hasNameValidationErrors = useMemo(() => {
        return (
            nameValidationErrors.firstName !== undefined ||
            nameValidationErrors.lastName !== undefined
        );
    }, [nameValidationErrors]);

    const hasNameChanged =
        changeUserNameRequest.firstName !== firstName ||
        changeUserNameRequest.lastName !== lastName;

    const passwordValidationErrors = useMemo<ChangePasswordErrors>(() => {
        const errors: ChangePasswordErrors = {
            oldPassword: undefined,
            newPassword: undefined,
            repeatNewPassword: undefined,
        };
        if (
            changePasswordRequest.oldPassword.trim().length === 0 &&
            changePasswordRequest.newPassword.trim().length === 0 &&
            changePasswordRequest.repeatNewPassword.trim().length === 0
        ) {
            return errors;
        }
        if (changePasswordRequest.oldPassword.trim().length === 0) {
            errors.oldPassword = E.OLD_PASSWORD_REQUIRED;
        }
        if (changePasswordRequest.newPassword.trim().length === 0) {
            errors.newPassword = E.NEW_PASSWORD_REQUIRED;
        }
        if (changePasswordRequest.repeatNewPassword.trim().length === 0) {
            errors.repeatNewPassword = E.REPEAT_NEW_PASSWORD_REQUIRED;
        }
        if (
            changePasswordRequest.newPassword !==
            changePasswordRequest.repeatNewPassword
        ) {
            errors.repeatNewPassword = E.PASSWORDS_DO_NOT_MATCH;
        }
        return errors;
    }, [changePasswordRequest]);

    const hasPasswordValidationErrors = useMemo(() => {
        return (
            passwordValidationErrors.oldPassword !== undefined ||
            passwordValidationErrors.newPassword !== undefined ||
            passwordValidationErrors.repeatNewPassword !== undefined
        );
    }, [passwordValidationErrors]);

    const fullName = `${firstName} ${lastName}`;
    const initials = `${firstName.length > 0 ? firstName[0] : ''}${
        lastName.length > 0 ? lastName[0] : ''
    }`;

    const [changeNameRequestState, setChangeNameRequestState] =
        useState<RequestState>({
            status: 'idle',
            errors: [],
        });

    const [changePasswordRequestState, setChangePasswordRequestState] =
        useState<RequestState>({
            status: 'idle',
            errors: [],
        });

    const changeName = () => {
        setChangeNameRequestState({
            status: 'pending',
            errors: [],
        });
        axiosAuthInstance
            .put(UPDATE_NAME, changeUserNameRequest)
            .then(() => {
                setChangeNameRequestState({
                    status: 'success',
                    errors: [],
                });
                dispatch(
                    updateName({
                        firstName: changeUserNameRequest.firstName,
                        lastName: changeUserNameRequest.lastName,
                    })
                );
            })
            .catch((error) => {
                const errors = getErrorsFromResponse(error);
                setChangeNameRequestState({
                    status: 'idle',
                    errors: (errors as string[]) ?? [E.SOMETHING_WENT_WRONG],
                });
            });
    };

    const changePassword = () => {
        setChangePasswordRequestState({
            status: 'pending',
            errors: [],
        });
        axiosAuthInstance
            .put(UPDATE_PASSWORD, {
                currentPassword: changePasswordRequest.oldPassword,
                newPassword: changePasswordRequest.newPassword,
            })
            .then(() => {
                setChangePasswordRequestState({
                    status: 'success',
                    errors: [],
                });
                setChangePasswordRequest({
                    oldPassword: '',
                    newPassword: '',
                    repeatNewPassword: '',
                });
            })
            .catch((error) => {
                const errors = getErrorsFromResponse(error);
                setChangePasswordRequestState({
                    status: 'idle',
                    errors: (errors as string[]) ?? [E.SOMETHING_WENT_WRONG],
                });
            });
    };

    if (!isLoggedIn) {
        return (
            <p>
                Not found (TODO: replace with NotFound component after merge (so
                i dont write it twice))
            </p>
        );
    }

    const renderNameInfo = () => (
        <Fragment>
            <FormTitle>{F.CHANGE_NAME_FORM_TITLE}</FormTitle>
            <PaddedTextField
                label={
                    nameValidationErrors.firstName ?? F.FIRST_NAME_INPUT_TITLE
                }
                error={nameValidationErrors.firstName !== undefined}
                value={changeUserNameRequest.firstName}
                onChange={(e) =>
                    setChangeUserNameRequest({
                        ...changeUserNameRequest,
                        firstName: e.target.value,
                    })
                }
            />

            <PaddedTextField
                label={nameValidationErrors.lastName ?? F.LAST_NAME_INPUT_TITLE}
                error={nameValidationErrors.lastName !== undefined}
                value={changeUserNameRequest.lastName}
                onChange={(e) =>
                    setChangeUserNameRequest({
                        ...changeUserNameRequest,
                        lastName: e.target.value,
                    })
                }
            />
            {changeNameRequestState.errors.length > 0 && (
                <Alert severity="error">
                    {changeNameRequestState.errors.map((error) => (
                        <div>{error}</div>
                    ))}
                </Alert>
            )}
            {changeNameRequestState.status === 'success' && (
                <Alert severity="success">{F.NAME_CHANGED_SUCCESSFULLY}</Alert>
            )}
            <ChangeButton
                disabled={
                    !hasNameChanged ||
                    hasNameValidationErrors ||
                    changeNameRequestState.status === 'pending'
                }
                variant="contained"
                color="primary"
                onClick={changeName}
            >
                Submit
            </ChangeButton>
        </Fragment>
    );

    const renderPassword = () => (
        <Fragment>
            <FormTitle>{F.CHANGE_PASSWORD_FORM_TITLE}</FormTitle>
            <PaddedTextField
                label={
                    passwordValidationErrors.oldPassword ??
                    F.OLD_PASSWORD_INPUT_TITLE
                }
                error={passwordValidationErrors.oldPassword !== undefined}
                type="password"
                value={changePasswordRequest.oldPassword}
                onChange={(e) =>
                    setChangePasswordRequest({
                        ...changePasswordRequest,
                        oldPassword: e.target.value,
                    })
                }
            />
            <PaddedTextField
                label={
                    passwordValidationErrors.newPassword ??
                    F.NEW_PASSWORD_INPUT_TITLE
                }
                error={passwordValidationErrors.newPassword !== undefined}
                type="password"
                value={changePasswordRequest.newPassword}
                onChange={(e) =>
                    setChangePasswordRequest({
                        ...changePasswordRequest,
                        newPassword: e.target.value,
                    })
                }
            />
            <PaddedTextField
                label={
                    passwordValidationErrors.repeatNewPassword ??
                    F.REPEAT_NEW_PASSWORD_INPUT_TITLE
                }
                error={passwordValidationErrors.repeatNewPassword !== undefined}
                type="password"
                value={changePasswordRequest.repeatNewPassword}
                onChange={(e) =>
                    setChangePasswordRequest({
                        ...changePasswordRequest,
                        repeatNewPassword: e.target.value,
                    })
                }
            />
            {changePasswordRequestState.errors.length > 0 && (
                <Alert severity="error">
                    {changePasswordRequestState.errors.map((error) => (
                        <div>{error}</div>
                    ))}
                </Alert>
            )}
            {changePasswordRequestState.status === 'success' && (
                <Alert severity="success">
                    {F.PASSWORD_CHANGED_SUCCESSFULLY}
                </Alert>
            )}
            <ChangeButton
                disabled={
                    hasPasswordValidationErrors ||
                    changePasswordRequestState.status === 'pending'
                }
                variant="contained"
                color="primary"
                onClick={changePassword}
            >
                Submit
            </ChangeButton>
        </Fragment>
    );

    const renderUserInfo = () => (
        <UserInfoForm>
            {renderNameInfo()}
            <SectionDivider />
            {renderPassword()}
        </UserInfoForm>
    );

    return (
        <Fragment>
            <Container>
                <Helmet>
                    <title>{fullName} - Profile Settings</title>
                </Helmet>
                <ProfileContainer>
                    <Row>
                        <FlexCol xs={12} md={6}>
                            <HideAt breakpoint="mediumAndBelow">
                                <LargeAvatarContainer>
                                    <Avatar>{initials}</Avatar>
                                </LargeAvatarContainer>
                            </HideAt>
                            <HideAt breakpoint="largeAndAbove">
                                <div style={{ paddingBottom: '16px' }}>
                                    <SmallAvatarContainer>
                                        <Avatar>{initials}</Avatar>
                                    </SmallAvatarContainer>
                                </div>
                            </HideAt>
                        </FlexCol>
                        <HideAt breakpoint="mediumAndBelow">
                            <Col xs={12} md={6}>
                                {renderUserInfo()}
                            </Col>
                        </HideAt>
                        <HideAt breakpoint="largeAndAbove">
                            <FlexCol xs={12} md={6}>
                                {renderUserInfo()}
                            </FlexCol>
                        </HideAt>
                    </Row>
                </ProfileContainer>
            </Container>
        </Fragment>
    );
};

export default UserProfileSettings;

const Container = styled.div`
    margin: 0 auto;
    width: 90%;
    display: flex;
    justify-content: center;
`;

const ProfileContainer = styled.div`
    height: 500px;
    width: 100%;
`;

const SmallAvatarContainer = styled.div`
    height: 200px;
    width: 200px;
    font-size: 100px;
`;

const LargeAvatarContainer = styled.div`
    height: 250px;
    width: 250px;
    font-size: 150px;
`;

const Avatar = styled.div`
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #f5f5f5;
    color: #000;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const FlexCol = styled(Col)`
    display: flex;
    justify-content: center;
    align-items: center;
`;

const PaddedTextField = styled(TextField)`
    margin-bottom: 16px;
    width: 300px;
`;

const UserInfoForm = styled.div`
    display: flex;
    flex-direction: column;
    width: 300px;
`;

const ChangeButton = styled(Button)`
    margin-bottom: 16px;
`;

const FormTitle = styled.h5`
    margin-bottom: 12px;
`;

const SectionDivider = styled(Divider)`
    margin-bottom: 16px;
`;
