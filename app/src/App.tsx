import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { BreakpointsProvider } from 'react-with-breakpoints';
import SomethingWentWrong from 'components/SomethingWentWrong';
import WithReduxProvider from './config/withReduxProvider';
import HomeScreen from './features/HomeScreen';
import AdminDashboard from 'features/AdminDashboard';
import AppHeader from './components/Header';
import BrowseMoviesScreen from './features/BrowseMoviesScreen';
import WithLocalStorageFetcher from 'config/withLocalStorageFetcher';
import UserProfileSettings from 'features/UserProfileSettings';
import theme from 'theme';
import MovieDetailsScreen from 'features/MovieDetailsScreen';
import WithAuthorization from 'config/withAuthorization';
import { ROLE_ADMINISTRATOR } from 'constants/index';
import NotFound from 'components/NotFound';
import { LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';

function App() {
    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <WithReduxProvider>
                <WithLocalStorageFetcher>
                    <BreakpointsProvider breakpoints={theme.breakpoints}>
                        <ErrorBoundary FallbackComponent={SomethingWentWrong}>
                            <BrowserRouter>
                                <AppHeader />
                                <Routes>
                                    <Route path="/" element={<HomeScreen />} />
                                    <Route
                                        path="/movies"
                                        element={<BrowseMoviesScreen />}
                                    />
                                    <Route
                                        path="/movie/:id"
                                        element={<MovieDetailsScreen />}
                                    />
                                    <Route
                                        path="/admin"
                                        element={
                                            <WithAuthorization
                                                role={ROLE_ADMINISTRATOR}
                                            >
                                                <AdminDashboard />
                                            </WithAuthorization>
                                        }
                                    />
                                    <Route
                                        path="/profile_settings"
                                        element={<UserProfileSettings />}
                                    />
                                    <Route
                                        path="/not-found"
                                        element={<NotFound />}
                                    />
                                    <Route path="*" element={<NotFound />} />
                                </Routes>
                            </BrowserRouter>
                        </ErrorBoundary>
                    </BreakpointsProvider>
                </WithLocalStorageFetcher>
            </WithReduxProvider>
        </LocalizationProvider>
    );
}

export default App;
