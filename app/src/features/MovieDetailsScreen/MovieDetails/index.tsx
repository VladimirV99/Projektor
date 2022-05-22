import { Fragment } from 'react';
import { Row, Col } from 'react-bootstrap';
import Movie from 'models/Movie';
import EmbeddedVideo from 'components/EmbeddedVideo';
import * as S from './index.styles';

type MovieDetailsProps = {
    movie: Movie;
};

const MovieDetails = ({ movie }: MovieDetailsProps): JSX.Element => {
    return (
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
                                            .map((g) => g.name.trim())
                                            .join(', ')}
                                    </td>
                                </tr>
                                <tr>
                                    <th>Actors:</th>
                                    <td>
                                        {movie.people
                                            .filter(
                                                ({ role }) => role === 'Actor'
                                            )
                                            .map((p) => p.name.trim())
                                            .join(', ')}
                                    </td>
                                </tr>
                                <tr>
                                    <th>Directors:</th>
                                    <td>
                                        {movie.people
                                            .filter(
                                                ({ role }) =>
                                                    role === 'Director'
                                            )
                                            .map((p) => p.name.trim())
                                            .join(', ')}
                                    </td>
                                </tr>
                                <tr>
                                    <th>Writers:</th>
                                    <td>
                                        {movie.people
                                            .filter(
                                                ({ role }) => role === 'Writer'
                                            )
                                            .map((p) => p.name.trim())
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
                    <EmbeddedVideo src={movie.trailerUrl}></EmbeddedVideo>
                </S.MovieTrailerContainer>
            )}
        </Fragment>
    );
};

export default MovieDetails;
