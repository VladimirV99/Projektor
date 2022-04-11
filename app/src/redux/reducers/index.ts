import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from "redux-persist/lib/storage";
import featuresReducer from '../../features/redux/reducers';
import { featuresReducerName } from '../../features/redux/reducers/types';

const rootReducer = combineReducers({
  [featuresReducerName]: featuresReducer
});
  
  const persistConfig = {
    key: 'root',
    storage: storage,
    whitelist: [],
    blacklist: [],
  };
  
  const persistedReducer = persistReducer(persistConfig, rootReducer);
  export default persistedReducer;
  