import { combineReducers } from 'redux';
import { authenticationReducerName } from '../../authentication/redux/reducers/types';
import authenticationReducer from '../../authentication/redux/reducers/index';
import { FeaturesReducerType } from './types';

const featuresReducer = combineReducers<FeaturesReducerType>({
  [authenticationReducerName]: authenticationReducer,
});


export default featuresReducer;