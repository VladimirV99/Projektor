import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import WithReduxProvider from './config/withReduxProvider';
import HomeScreen from './features/HomeScreen';
import AppHeader from './components/Header';
import { selectIsUserLoggedIn } from './redux/auth/selectors';

function App() {

  return (
    <WithReduxProvider>
      <AppHeader />
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<HomeScreen />} />
        </Routes>
      </BrowserRouter>
    </WithReduxProvider>
  );
}

export default App;
