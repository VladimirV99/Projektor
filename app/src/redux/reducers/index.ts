import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from "redux-persist/lib/storage";
import featuresReducer from '../auth/index';
import { featuresReducerName } from '../auth/types';
import moviesReducer from './Movie';
import genresReducer from './Genre';
import filterLimitsReducer from './FilterLimits'

const rootReducer = combineReducers({
  [featuresReducerName]: featuresReducer,
  movies: moviesReducer,
  genres: genresReducer,
  filterLimits: filterLimitsReducer
});
  
const persistConfig = {
  key: 'root',
  storage: storage,
  whitelist: [],
  blacklist: [],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
export default persistedReducer;
