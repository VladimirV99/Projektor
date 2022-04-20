import {
    AuthenticationReducerType,
    authenticationReducerName,
} from '../auth/reducers/types';

export const featuresReducerName = 'featureReducer';

export interface FeaturesReducerType {
    [authenticationReducerName]: AuthenticationReducerType;
}
