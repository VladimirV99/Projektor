import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { BreakpointsProvider } from 'react-with-breakpoints';
import SomethingWentWrong from 'components/SomethingWentWrong';
import WithReduxProvider from './config/withReduxProvider';
import HomeScreen from './features/HomeScreen';
import AppHeader from './components/Header';
import BrowseMoviesScreen from './features/BrowseMoviesScreen';
import WithLocalStorageFetcher from 'config/withLocalStorageFetcher';
import UserProfileSettings from 'features/UserProfileSettings';
import theme from 'theme';

function App() {
    return (
        <WithReduxProvider>
            <WithLocalStorageFetcher>
                <BreakpointsProvider breakpoints={theme.breakpoints}>
                    <ErrorBoundary FallbackComponent={SomethingWentWrong}>
                        <AppHeader />
                        <BrowserRouter>
                            <Routes>
                                <Route path="/" element={<HomeScreen />} />
                                <Route
                                    path="/movies"
                                    element={<BrowseMoviesScreen />}
                                />
                                <Route
                                    path="/profile_settings"
                                    element={<UserProfileSettings />}
                                />
                            </Routes>
                        </BrowserRouter>
                    </ErrorBoundary>
                </BreakpointsProvider>
            </WithLocalStorageFetcher>
        </WithReduxProvider>
    );
}

export default App;
