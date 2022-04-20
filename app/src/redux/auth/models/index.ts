export type userType = {
    id: string
    firstName: string
    lastName: string
    email: string
}

export type userRegisterRequest = {
    email: string
    firstName: string
    lastName: string
    password: string
}

export type userLoginRequest = {
    email: string
    password: string
}

export type loginResponse = {
    accessToken: string
    refreshToken: string
    user: userType
}
