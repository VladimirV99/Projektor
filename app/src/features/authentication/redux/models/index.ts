export type userRegisterRequest = {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
};

export type userLoginRequest = {
    email: string;
    password: string;
};

export type loginResponse = {
    accessToken: string;
    refreshToken: string;
    user: any;
}