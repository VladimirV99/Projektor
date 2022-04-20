import { configureStore } from '@reduxjs/toolkit';

import rootReducer from './reducers';

// TODO Add support for network middleware
// const networkMiddleware =
//   ({ getState }: MiddlewareAPI) =>
//   (next: Middleware) =>
//   (action: any) => {
//     // check if action is thunk action -> if yes, first check connection
//     if (typeof action === 'function') {
//       const isConnected = selectIsConnected(getState());
//       if (!isConnected) {
//         return Promise.reject();
//       }
//       return next(action);
//     }
//     return next(action);
//   };

const store = configureStore({
  reducer: rootReducer,
  preloadedState: { },
  middleware: (getDefaultMiddleware) => {
    const middlewares = getDefaultMiddleware({ serializableCheck: false, immutableCheck: false }); 
    return middlewares;
  },
});

export default store;
