import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { faClapperboard } from '@fortawesome/free-solid-svg-icons/faClapperboard';
import { faClock } from '@fortawesome/free-regular-svg-icons/faClock';
import { faLink } from '@fortawesome/free-solid-svg-icons/faLink';
import Movie from 'models/Movie';
import * as S from './index.styles';

type MovieCardProps = {
    movie: Movie;
};

const MovieCard = ({ movie }: MovieCardProps): JSX.Element => {
    const { id, title, year, length, genres, imdbUrl, imageUrl } = movie;
    const genresDisplayString =
        genres.length > 0
            ? genres.map((genre) => genre.name.trim()).join(', ')
            : 'Other';

    return (
        <S.MovieCardContainer>
            <S.MovieCardRow>
                <S.MovieCardCol xs={3}>
                    <S.MovieCoverImageContainer>
                        <S.MovieCoverImage
                            src={imageUrl || '/movie_placeholder.jpg'}
                        />
                    </S.MovieCoverImageContainer>
                </S.MovieCardCol>
                <S.MovieInfoCol xs={9}>
                    <div style={{ display: 'flex' }}>
                        <S.MovieTitle>
                            <Link to={`/movie/${id}`}>{title}</Link>
                        </S.MovieTitle>
                        <S.MovieYear>({year})</S.MovieYear>
                    </div>

                    <S.MovieInfo>
                        <S.MovieInfoIcon icon={faClapperboard} />
                        {genresDisplayString}
                    </S.MovieInfo>

                    <S.MovieInfo>
                        <S.MovieInfoIcon icon={faClock} />
                        {length} min
                    </S.MovieInfo>

                    {imdbUrl && (
                        <S.MovieInfo>
                            <S.MovieInfoIcon icon={faLink} />
                            <a
                                href={imdbUrl! as string}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                View on IMDB
                            </a>
                        </S.MovieInfo>
                    )}
                </S.MovieInfoCol>
            </S.MovieCardRow>
        </S.MovieCardContainer>
    );
};

export default MovieCard;
