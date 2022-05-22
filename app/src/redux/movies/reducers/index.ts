import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import moviesReducer from 'redux/movies/reducers/Movie';
import genresReducer from 'redux/movies/reducers/Genre';
import filterLimitsReducer from 'redux/movies/reducers/FilterLimits';
import rolesReducer from 'redux/movies/reducers/Roles';

const rootReducer = combineReducers({
    movies: moviesReducer,
    genres: genresReducer,
    filterLimits: filterLimitsReducer,
    roles: rolesReducer,
});

const persistConfig = {
    key: 'root',
    storage: storage,
    whitelist: [],
    blacklist: [],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
export default persistedReducer;
