import { AuthenticationReducerType, authenticationReducerName } from '../../authentication/redux/reducers/types';

export const featuresReducerName = 'featureReducer';

export interface FeaturesReducerType {
  [authenticationReducerName]: AuthenticationReducerType;
}
