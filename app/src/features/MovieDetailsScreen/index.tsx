import { Fragment, useCallback, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Col, Row } from 'react-bootstrap';
import { Backdrop, CircularProgress } from '@mui/material';
import useAsyncError from 'hooks/useAsyncError';
import { getMovie } from 'redux/movie/reducers/Movie';
import { getScreeningsForMovie } from 'redux/movie/reducers/Screenings';
import * as selectors from 'redux/movie/selectors';
import Movie from 'models/Movie';
import Screening from 'models/Screening';
import { removeTime } from 'util/dateUtils';
import ScheduleItem from 'models/Screening/ScreeningSchedule';
import ScreeningSchedule from 'components/ScreeningSchedule';
import SomethingWentWrong from 'components/SomethingWentWrong';
import * as S from './index.styles';
import EmbeddedVideo from 'components/EmbeddedVideo';

const MovieDetailsScreen = (): JSX.Element => {
    const { id } = useParams();
    // This will never happen because the route wouldn't match
    // but typescript requires the null check
    if (id === undefined) {
        return <SomethingWentWrong></SomethingWentWrong>;
    }

    const throwAsyncError = useAsyncError();
    const dispatch = useDispatch();

    const movie = useSelector(selectors.getMovie);
    const movieStatus = useSelector(selectors.getMovieStatus);

    const movieScreenings = useSelector(selectors.getScreeningsForMovie);
    const movieScreeningsStatus = useSelector(
        selectors.getScreeningsForMovieStatus
    );

    const isMovieLoading = movieStatus === 'pending' || movieStatus === 'idle';
    const areScreeningsLoading =
        movieScreeningsStatus === 'pending' || movieScreeningsStatus === 'idle';

    const screeningGroups = useMemo(() => {
        // Filter out screenings that have ended
        // let filteredScreenings = movieScreenings.filter(
        //     (s) => s.movieStart.getTime() >= Date.now()
        // );
        let filteredScreenings = movieScreenings;

        // group screening by date
        // Dictionary<date: string, screenings: Screenings[]>
        let dict = filteredScreenings.reduce(
            (groups: any, screening: Screening): any => {
                let day = new Date(screening.movieStart.getTime());
                removeTime(day);
                let key = day.getTime().toString();

                if (!groups.hasOwnProperty(key)) groups[key] = [];
                groups[key].push(screening);
                return groups;
            },
            {}
        );

        // Convert dictionary to array of objects
        // [{ day: number, screenings: Screening[] }]
        let groups: ScheduleItem[] = [];
        Object.keys(dict).forEach((key) => {
            groups.push(new ScheduleItem(key, dict[key]));
        });

        // Sort by day
        groups.sort((a, b) => {
            return parseInt(a.key) - parseInt(b.key);
        });

        return groups;
    }, [movieScreenings]);

    const renderLoading = useCallback(() => {
        return (
            <Backdrop open={true}>
                <CircularProgress />
            </Backdrop>
        );
    }, []);

    const renderMovie = useCallback(() => {
        return isMovieLoading ? (
            renderLoading()
        ) : movie !== null ? (
            <Fragment>
                <Row>
                    <Col xs={4} md={3} lg={2}>
                        <S.MoviePoster
                            src={movie.imageUrl || '/movie_placeholder.jpg'}
                        />
                    </Col>
                    <Col xs={8} md={9} lg={10}>
                        <div>
                            <h1>{movie.title}</h1>
                            <S.MovieInfoTable>
                                <tr>
                                    <th>Year:</th>
                                    <td>{movie.year}</td>
                                </tr>
                                <tr>
                                    <th>Length:</th>
                                    <td>{movie.length} min</td>
                                </tr>
                                <tr>
                                    <th>Genres:</th>
                                    <td>
                                        {movie.genres
                                            .map((g) => g.name.trim())
                                            .join(', ')}
                                    </td>
                                </tr>
                                <tr>
                                    <th>Actors:</th>
                                    <td>
                                        {movie.people
                                            .filter((p) => p.role === 'Actor')
                                            .map((p) => p.name.trim())
                                            .join(', ')}
                                    </td>
                                </tr>
                                <tr>
                                    <th>Directors:</th>
                                    <td>
                                        {movie.people
                                            .filter(
                                                (p) => p.role === 'Director'
                                            )
                                            .map((p) => p.name.trim())
                                            .join(', ')}
                                    </td>
                                </tr>
                                <tr>
                                    <th>Writers:</th>
                                    <td>
                                        {movie.people
                                            .filter((p) => p.role === 'Writer')
                                            .map((p) => p.name.trim())
                                            .join(', ')}
                                    </td>
                                </tr>
                            </S.MovieInfoTable>
                        </div>

                        {movie.imdbUrl && (
                            <a
                                href={movie.imdbUrl! as string}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                View on IMDB
                            </a>
                        )}
                    </Col>
                </Row>

                {movie.trailerUrl && (
                    <S.MovieTrailerContainer>
                        <EmbeddedVideo src={movie.trailerUrl}></EmbeddedVideo>
                    </S.MovieTrailerContainer>
                )}
            </Fragment>
        ) : (
            <p>Movie not found.</p>
        );
    }, [movie, renderLoading, isMovieLoading]);

    const renderScreenings = useCallback(() => {
        return (
            <Fragment>
                <div>
                    <h3>Screenings</h3>
                </div>

                {areScreeningsLoading ? (
                    renderLoading()
                ) : screeningGroups.length > 0 ? (
                    <ScreeningSchedule
                        schedule={screeningGroups}
                    ></ScreeningSchedule>
                ) : (
                    <h3>There are no screenings for this movie</h3>
                )}
            </Fragment>
        );
    }, [screeningGroups, areScreeningsLoading]);

    useEffect(() => {
        if (movieStatus !== 'idle') {
            return;
        }
        dispatch(getMovie(parseInt(id)));
    }, [dispatch, movieStatus]);

    useEffect(() => {
        if (movieStatus !== 'success' || movieScreeningsStatus !== 'idle') {
            return;
        }
        dispatch(getScreeningsForMovie(parseInt(id)));
    }, [dispatch, movieStatus, movieScreeningsStatus]);

    useEffect(() => {
        if (movieStatus === 'error' || movieScreeningsStatus === 'error') {
            throwAsyncError(new Error('Something went wrong'));
        }
    }, [movieStatus, movieScreeningsStatus, throwAsyncError]);

    return (
        <S.Panel>
            {renderMovie()}
            {renderScreenings()}
        </S.Panel>
    );
};

export default MovieDetailsScreen;
