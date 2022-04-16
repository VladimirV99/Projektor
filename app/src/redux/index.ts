import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from "redux-persist/lib/storage";
import featuresReducer from './auth/index';
import { featuresReducerName } from './auth/types';
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
  