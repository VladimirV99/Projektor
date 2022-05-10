import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import {
    authenticationReducerName,
    AuthenticationReducerType,
} from 'redux/auth/reducers/types';
import authenticationReducer from 'redux/auth/reducers';
import moviesReducer from 'redux/movies/reducers';

export const featuresReducerName = 'featuresReducer';
interface FeaturesReducerType {
    [authenticationReducerName]: AuthenticationReducerType;
    movies: any;
}

const featuresReducer = combineReducers<FeaturesReducerType>({
    [authenticationReducerName]: authenticationReducer,
    movies: moviesReducer,
});

const rootReducer = combineReducers({
    [featuresReducerName]: featuresReducer,
});

const store = configureStore({
    reducer: rootReducer,
    preloadedState: {},
    middleware: (getDefaultMiddleware) => {
        const middlewares = getDefaultMiddleware({
            serializableCheck: false,
            immutableCheck: false,
        });
        return middlewares;
    },
});

export default store;
