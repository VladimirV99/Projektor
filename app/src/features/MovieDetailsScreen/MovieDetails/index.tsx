import { Fragment } from 'react';
import { Row, Col } from 'react-bootstrap';
import Movie from 'models/Movie';
import EmbeddedVideo from 'components/EmbeddedVideo';
import * as S from './index.styles';

type MovieDetailsProps = {
    movie: Movie;
};

const MovieDetails = ({ movie }: MovieDetailsProps): JSX.Element => {
    const {
        title,
        year,
        length,
        trailerUrl,
        imdbUrl,
        imageUrl,
        genres,
        people,
    } = movie;
    return (
        <Fragment>
            <Row>
                <Col xs={4} md={3} lg={2}>
                    <S.MoviePoster src={imageUrl || '/movie_placeholder.jpg'} />
                </Col>
                <Col xs={8} md={9} lg={10}>
                    <div>
                        <h1>{title}</h1>
                        <S.MovieInfoTable>
                            <tbody>
                                <tr>
                                    <th>Year:</th>
                                    <td>{year}</td>
                                </tr>
                                <tr>
                                    <th>Length:</th>
                                    <td>{length} min</td>
                                </tr>
                                <tr>
                                    <th>Genres:</th>
                                    <td>
                                        {genres
                                            .map((g) => g.name.trim())
                                            .join(', ')}
                                    </td>
                                </tr>
                                <tr>
                                    <th>Actors:</th>
                                    <td>
                                        {people
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
                                        {people
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
                                        {people
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

                    {imdbUrl && (
                        <a
                            href={imdbUrl! as string}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            View on IMDB
                        </a>
                    )}
                </Col>
            </Row>

            {trailerUrl && (
                <S.MovieTrailerContainer>
                    <EmbeddedVideo src={trailerUrl} />
                </S.MovieTrailerContainer>
            )}
        </Fragment>
    );
};

export default MovieDetails;
