export type ChangeUserNameRequest = {
    firstName: string;
    lastName: string;
};

export type ChangeUserNameErrors = {
    firstName: string | undefined;
    lastName: string | undefined;
};

export type ChangePasswordRequest = {
    oldPassword: string;
    newPassword: string;
    repeatNewPassword: string;
};

export type ChangePasswordErrors = {
    oldPassword: string | undefined;
    newPassword: string | undefined;
    repeatNewPassword: string | undefined;
};

export type RequestState = {
    status: 'idle' | 'pending' | 'success';
    errors: string[];
};
