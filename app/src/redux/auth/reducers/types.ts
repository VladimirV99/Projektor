import { LoadingStatus } from '../../../constants/common';
import { userType } from '../models';

export const authenticationReducerName = 'authentication';

export interface AuthenticationReducerType {
    loadingStatus: LoadingStatus;
    user: userType | null;
    errors: any;
}