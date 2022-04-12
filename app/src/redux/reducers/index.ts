import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from "redux-persist/lib/storage";
import moviesReducer from './Movie/index';
import genresReducer from './Genre/index';

const rootReducer = combineReducers({
  movies: moviesReducer,
  genres: genresReducer
});

const persistConfig = {
  key: 'root',
  storage: storage,
  whitelist: [],
  blacklist: [],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
export default persistedReducer;
