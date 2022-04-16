import { LoadingStatus } from '../../../constants/common';

export const authenticationReducerName = 'authentication';

export interface AuthenticationReducerType {
    loadingStatus: LoadingStatus;
    user: any; // TODO: Make a type for user
}