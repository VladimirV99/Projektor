import { useCallback, useEffect, useMemo } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Backdrop, CircularProgress } from '@mui/material';
import useAsyncError from 'hooks/useAsyncError';
import { getMovie } from 'redux/movie/reducers/Movie';
import {
    getScreeningsForMovie,
    resetScreeningStatus,
} from 'redux/movie/reducers/Screenings';
import * as selectors from 'redux/movie/selectors';
import { removeTime } from 'util/dateUtils';
import Screening from 'models/Screening';
import ScheduleItem from 'models/Screening/ScreeningSchedule';
import ScreeningSchedule from 'components/ScreeningSchedule';
import SomethingWentWrong from 'components/SomethingWentWrong';
import MovieDetails from './MovieDetails';
import MovieReviews from './MovieReviews';
import * as S from './index.styles';

const MovieDetailsScreen = (): JSX.Element => {
    const { id: _id } = useParams();
    // This will never happen because the route wouldn't match
    // but typescript requires the null check
    if (_id === undefined) {
        return <SomethingWentWrong />;
    }
    const movieId = parseInt(_id);

    const throwAsyncError = useAsyncError();
    const dispatch = useDispatch();

    const movie = useSelector(selectors.getMovie);
    const movieStatus = useSelector(selectors.getMovieStatus);
    const isMovieLoading = movieStatus === 'idle' || movieStatus === 'pending';

    const screenings = useSelector(selectors.getScreeningsForMovie);
    const screeningsStatus = useSelector(selectors.getScreeningsForMovieStatus);
    const areScreeningsLoading =
        screeningsStatus === 'idle' || screeningsStatus === 'pending';

    const screeningGroups = useMemo(() => {
        // Filter out screenings that have ended and group the rest by date
        // returns Dictionary<date: string, screenings: Screenings[]>
        const dict = screenings
            //.filter((s) => s.movieStart.getTime() >= Date.now())
            .reduce((groups: any, screening: Screening): any => {
                let day = new Date(screening.movieStart);
                removeTime(day);
                let key = day.getTime();

                if (!groups.hasOwnProperty(key)) groups[key] = [];
                groups[key].push(screening);
                return groups;
            }, {});

        // Convert dictionary to array of objects
        // returns [{ key: number, screenings: Screening[] }]
        const groups = Object.entries(dict).map(([key, value]) => {
            // Sort screenings by start time
            (value as Screening[]).sort((a, b) => {
                return (
                    new Date(a.movieStart).getTime() -
                    new Date(b.movieStart).getTime()
                );
            });
            return new ScheduleItem(key, value as Screening[]);
        });

        // Sort groups by day
        groups.sort((a, b) => {
            return parseInt(a.key) - parseInt(b.key);
        });

        return groups;
    }, [screenings]);

    const renderLoading = useCallback(() => {
        return (
            <Backdrop open={true}>
                <CircularProgress />
            </Backdrop>
        );
    }, []);

    const renderMovie = useCallback(() => {
        if (isMovieLoading) {
            return renderLoading();
        } else {
            if (movie !== null) {
                return <MovieDetails movie={movie} />;
            } else {
                return <Navigate to="/NotFound" />;
            }
        }
    }, [movie, renderLoading, isMovieLoading]);

    const renderScreenings = useCallback(() => {
        if (areScreeningsLoading) {
            return <CircularProgress />;
        }

        // Screening service is down or the request was invalid
        if (screeningsStatus === 'error') {
            return <h5>Screenings are currently unavailable</h5>;
        }

        if (screeningGroups.length > 0) {
            return <ScreeningSchedule schedule={screeningGroups} />;
        } else {
            return <h5>There are no screenings for this movie</h5>;
        }
    }, [screeningGroups, areScreeningsLoading, screeningsStatus]);

    useEffect(() => {
        if (
            movieStatus === 'pending' ||
            (movieStatus !== 'idle' && movie?.id === movieId)
        ) {
            return;
        }
        dispatch(resetScreeningStatus());
        dispatch(getMovie(movieId));
    }, [dispatch, movieStatus, movie]);

    useEffect(() => {
        if (
            movieStatus !== 'success' ||
            movie?.id !== movieId ||
            screeningsStatus !== 'idle'
        ) {
            return;
        }
        dispatch(getScreeningsForMovie(movieId));
    }, [dispatch, movieStatus, screeningsStatus, movie]);

    useEffect(() => {
        if (movieStatus === 'error') {
            throwAsyncError(new Error('Something went wrong'));
        }
    }, [movieStatus, screeningsStatus, throwAsyncError]);

    return (
        <S.Panel>
            {renderMovie()}

            <div>
                <h3>Screenings</h3>
            </div>
            {renderScreenings()}

            <MovieReviews isMovieLoaded={!isMovieLoading} movieId={movieId} />
        </S.Panel>
    );
};

export default MovieDetailsScreen;
