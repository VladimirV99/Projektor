import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import WithReduxProvider from './config/withReduxProvider';
import HomeScreen from './features/HomeScreen';

function App() {
  return (
    <WithReduxProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<HomeScreen/>} />
        </Routes>
      </BrowserRouter>
    </WithReduxProvider>
  );
}

export default App;
