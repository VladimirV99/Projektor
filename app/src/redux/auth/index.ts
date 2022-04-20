import { combineReducers } from 'redux';
import { authenticationReducerName } from './reducers/types';
import authenticationReducer from './reducers';
import { FeaturesReducerType } from '../auth/types';

const featuresReducer = combineReducers<FeaturesReducerType>({
    [authenticationReducerName]: authenticationReducer,
});

export default featuresReducer;
