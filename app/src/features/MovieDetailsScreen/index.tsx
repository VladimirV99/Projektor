import { Fragment, useCallback, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Col, Row } from 'react-bootstrap';
import { Backdrop, CircularProgress } from '@mui/material';
import useAsyncError from 'hooks/useAsyncError';
import { getMovie } from 'redux/movie/reducers/Movie';
import { getScreeningsForMovie } from 'redux/movie/reducers/Screenings';
import * as selectors from 'redux/movie/selectors';
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
        return <SomethingWentWrong />;
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
        // Filter out screenings that have ended and group the rest by date
        // returns Dictionary<date: string, screenings: Screenings[]>
        const dict = movieScreenings
            //.filter((s) => s.movieStart.getTime() >= Date.now())
            .reduce((groups: any, screening: Screening): any => {
                let day = new Date(screening.movieStart);
                removeTime(day);
                let key = day.toString();

                if (!groups.hasOwnProperty(key)) groups[key] = [];
                groups[key].push(screening);
                return groups;
            }, {});

        // Convert dictionary to array of objects
        // returns [{ key: number, screenings: Screening[] }]
        const groups = Object.entries(dict).map(
            ([key, value]) => new ScheduleItem(key, value as Screening[])
        );

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
        if (isMovieLoading) {
            return renderLoading();
        } else {
            if (movie !== null) {
                return (
                    <Fragment>
                        <Row>
                            <Col xs={4} md={3} lg={2}>
                                <S.MoviePoster
                                    src={
                                        movie.imageUrl ||
                                        '/movie_placeholder.jpg'
                                    }
                                />
                            </Col>
                            <Col xs={8} md={9} lg={10}>
                                <div>
                                    <h1>{movie.title}</h1>
                                    <S.MovieInfoTable>
                                        <tbody>
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
                                                        .map((g) =>
                                                            g.name.trim()
                                                        )
                                                        .join(', ')}
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>Actors:</th>
                                                <td>
                                                    {movie.people
                                                        .filter(
                                                            ({ role }) =>
                                                                role === 'Actor'
                                                        )
                                                        .map((p) =>
                                                            p.name.trim()
                                                        )
                                                        .join(', ')}
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>Directors:</th>
                                                <td>
                                                    {movie.people
                                                        .filter(
                                                            ({ role }) =>
                                                                role ===
                                                                'Director'
                                                        )
                                                        .map((p) =>
                                                            p.name.trim()
                                                        )
                                                        .join(', ')}
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>Writers:</th>
                                                <td>
                                                    {movie.people
                                                        .filter(
                                                            ({ role }) =>
                                                                role ===
                                                                'Writer'
                                                        )
                                                        .map((p) =>
                                                            p.name.trim()
                                                        )
                                                        .join(', ')}
                                                </td>
                                            </tr>
                                        </tbody>
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
                                <EmbeddedVideo
                                    src={movie.trailerUrl}
                                ></EmbeddedVideo>
                            </S.MovieTrailerContainer>
                        )}
                    </Fragment>
                );
            } else {
                return <p>Movie not found.</p>;
            }
        }
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
                    <h5>There are no screenings for this movie</h5>
                )}
            </Fragment>
        );
    }, [screeningGroups, areScreeningsLoading]);

    useEffect(() => {
        if (movieStatus !== 'idle' && movie?.id === parseInt(id)) {
            return;
        }
        dispatch(getMovie(parseInt(id)));
    }, [dispatch, movieStatus, movie]);

    useEffect(() => {
        if (
            (movieStatus !== 'success' || movieScreeningsStatus !== 'idle') &&
            movie?.id === parseInt(id)
        ) {
            return;
        }
        dispatch(getScreeningsForMovie(parseInt(id)));
    }, [dispatch, movieStatus, movieScreeningsStatus, movie]);

    useEffect(() => {
        if (movieStatus === 'error') {
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
