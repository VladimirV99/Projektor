import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import SomethingWentWrong from 'components/SomethingWentWrong';
import WithReduxProvider from './config/withReduxProvider';
import HomeScreen from './features/HomeScreen';
import AppHeader from './components/Header';
import BrowseMoviesScreen from './features/BrowseMoviesScreen';
import WithLocalStorageFetcher from 'config/withLocalStorageFetcher';

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
                        </Routes>
                    </BrowserRouter>
                </ErrorBoundary>
            </WithLocalStorageFetcher>
        </WithReduxProvider>
    );
}

export default App;
