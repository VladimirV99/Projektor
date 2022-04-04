import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import WithReduxProvider from './config/withReduxProvider';
import HomeScreen from './features/HomeScreen';
import BrowseMoviesScreen from './features/BrowseMoviesScreen';

function App() {
  return (
    <WithReduxProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<HomeScreen/>} />
          <Route path="/movies" element={<BrowseMoviesScreen />} /> 
        </Routes>
      </BrowserRouter>
    </WithReduxProvider>
  );
}

export default App;
