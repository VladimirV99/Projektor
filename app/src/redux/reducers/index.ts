import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from "redux-persist/lib/storage";
import moviesReducer from './Movie';
import genresReducer from './Genre';
import filterLimitsReducer from './FilterLimits'

const rootReducer = combineReducers({
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
