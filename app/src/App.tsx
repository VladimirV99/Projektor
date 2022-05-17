import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import SomethingWentWrong from 'components/SomethingWentWrong';
import WithReduxProvider from './config/withReduxProvider';
import HomeScreen from './features/HomeScreen';
import AdminDashboard from 'features/AdminDashboard';
import AppHeader from './components/Header';
import BrowseMoviesScreen from './features/BrowseMoviesScreen';
import WithLocalStorageFetcher from 'config/withLocalStorageFetcher';
import MovieDetailsScreen from 'features/MovieDetailsScreen';
import WithAuthorization from 'config/withAuthorization';
import { ROLE_ADMINISTRATOR } from 'constants/index';
import NotFound from 'components/NotFound';

function App() {
    return (
        <WithReduxProvider>
            <WithLocalStorageFetcher>
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
                            <Route path="/not-found" element={<NotFound />} />
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </BrowserRouter>
                </ErrorBoundary>
            </WithLocalStorageFetcher>
        </WithReduxProvider>
    );
}

export default App;
