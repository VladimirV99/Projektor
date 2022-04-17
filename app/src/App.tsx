import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import WithReduxProvider from './config/withReduxProvider';
import HomeScreen from './features/HomeScreen';
import BrowseMoviesScreen from './features/BrowseMoviesScreen';
import { ErrorBoundary } from 'react-error-boundary';
import SomethingWentWrong from 'components/SomethingWentWrong';

function App() {
  return (
    <WithReduxProvider>
      <ErrorBoundary FallbackComponent={SomethingWentWrong}>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<HomeScreen/>} />
            <Route path="/movies" element={<BrowseMoviesScreen />} /> 
          </Routes>
        </BrowserRouter>
      </ErrorBoundary>
    </WithReduxProvider>
  );
}

export default App;
