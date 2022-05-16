import { Fragment, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { selectIsUserLoggedIn, selectUser } from 'redux/auth/selectors';
import Helmet from 'react-helmet';
import { Col, Row } from 'react-bootstrap';
import { HideAt, ShowAt } from 'react-with-breakpoints';
import { Button, Divider, TextField } from '@mui/material';

type ChangeUserNameRequest = {
    firstName: string;
    lastName: string;
};

type ChangeUserNameErrors = {
    firstName: string | undefined;
    lastName: string | undefined;
};

type ChangePasswordRequest = {
    oldPassword: string;
    newPassword: string;
    repeatNewPassword: string;
};

type ChangePasswordErrors = {
    oldPassword: string | undefined;
    newPassword: string | undefined;
    repeatNewPassword: string | undefined;
};

const UserProfile = () => {
    const isLoggedIn = useSelector(selectIsUserLoggedIn);
    const user = useSelector(selectUser);
    const firstName = user?.firstName ?? '';
    const lastName = user?.lastName ?? '';

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

    useEffect(() => {
        console.log('Mounted with fname, lname: ', firstName, lastName);
    }, []);

    const nameValidationErrors = useMemo<ChangeUserNameErrors>(() => {
        const errors: ChangeUserNameErrors = {
            firstName: undefined,
            lastName: undefined,
        };
        if (changeUserNameRequest.firstName.trim().length === 0) {
            errors.firstName = 'First name is required';
        }
        if (changeUserNameRequest.lastName.trim().length === 0) {
            errors.lastName = 'Last name is required';
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
            errors.oldPassword = 'Old password is required';
        }
        if (changePasswordRequest.newPassword.trim().length === 0) {
            errors.newPassword = 'New password is required';
        }
        if (changePasswordRequest.repeatNewPassword.trim().length === 0) {
            errors.repeatNewPassword = 'Please repeat new password';
        }
        if (
            changePasswordRequest.newPassword !==
            changePasswordRequest.repeatNewPassword
        ) {
            errors.repeatNewPassword = 'Passwords do not match';
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

    if (!isLoggedIn) {
        return (
            <p>
                Not found (TODO: replace with NotFound component after merge (so
                i dont write it twice))
            </p>
        );
    }

    const fullName = `${firstName} ${lastName}`;
    const initials = `${firstName.length > 0 ? firstName[0] : ''}${
        lastName.length > 0 ? lastName[0] : ''
    }`;

    const renderNameInfo = () => (
        <Fragment>
            <FormTitle>Change name</FormTitle>
            <PaddedTextField
                label={nameValidationErrors.firstName ?? 'First name'}
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
                label={nameValidationErrors.lastName ?? 'LastName'}
                error={nameValidationErrors.lastName !== undefined}
                value={changeUserNameRequest.lastName}
                onChange={(e) =>
                    setChangeUserNameRequest({
                        ...changeUserNameRequest,
                        lastName: e.target.value,
                    })
                }
            />
            <ChangeButton
                disabled={!hasNameChanged || hasNameValidationErrors}
                variant="contained"
                color="primary"
                onClick={() => {
                    console.log('change name request: ', changeUserNameRequest);
                }}
            >
                Submit
            </ChangeButton>
        </Fragment>
    );

    const renderPassword = () => (
        <Fragment>
            <FormTitle>Change password</FormTitle>
            <PaddedTextField
                label={passwordValidationErrors.oldPassword ?? 'Old password'}
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
                label={passwordValidationErrors.newPassword ?? 'New password'}
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
                    'Repeat new password'
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
            <ChangeButton
                disabled={hasPasswordValidationErrors}
                variant="contained"
                color="primary"
                onClick={() => {
                    console.log(
                        'change password request: ',
                        changePasswordRequest
                    );
                }}
            >
                Submit
            </ChangeButton>
        </Fragment>
    );

    const renderUserInfo = () => (
        <UserInfoForm>
            {renderNameInfo()}
            <Divider style={{ marginBottom: '16px' }} />
            {renderPassword()}
        </UserInfoForm>
    );

    return (
        <Fragment>
            <Container>
                <Helmet>
                    <title>{fullName} - User Profile</title>
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

export default UserProfile;

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
