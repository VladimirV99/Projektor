import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from "redux-persist/lib/storage";

const rootReducer = combineReducers({});
  
  const persistConfig = {
    key: 'root',
    storage: storage,
    whitelist: [],
    blacklist: [],
  };
  
  const persistedReducer = persistReducer(persistConfig, rootReducer);
  export default persistedReducer;
  