import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import movieReducer from 'redux/movie/reducers/Movie';
import screeningsReducer from 'redux/movie/reducers/Screenings';

const rootReducer = combineReducers({
    movie: movieReducer,
    screenings: screeningsReducer
});

const persistConfig = {
    key: 'root',
    storage: storage,
    whitelist: [],
    blacklist: [],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
export default persistedReducer;
