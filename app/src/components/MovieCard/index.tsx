import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClapperboard } from '@fortawesome/free-solid-svg-icons/faClapperboard';
import { faClock } from '@fortawesome/free-regular-svg-icons/faClock';
import { faLink } from '@fortawesome/free-solid-svg-icons/faLink';
import Movie from '@models/Movie'
import * as S from './index.styles';

type MovieCardProps = {
    movie: Movie;
}

const MovieCard = ({ movie }: MovieCardProps): JSX.Element => {
    const { title, year, length, people, genres, imdbUrl, imageUrl } = movie;
    const genresDisplayString = genres.map(genre => genre.name.trim()).join(', ');

    return <S.MovieCardContainer>
        <S.MovieCardRow>
            <Col xs={3} sm={3} md={2}>
                <S.MovieCoverImageContainer>
                    <S.MovieCoverImage src={imageUrl || "/movie_placeholder.jpg"} />
                </S.MovieCoverImageContainer>
            </Col>
            <Col xs={9} sm={9} md={10}>
                <div style={{display: 'flex'}}>
                    <S.MovieTitle>{title}</S.MovieTitle>
                    <S.MovieYear> ({year}) </S.MovieYear>
                </div>
                
                {genres.length > 0 && 
                <S.MovieInfo>
                    <S.MovieInfoIcon icon={faClapperboard} />
                    {genresDisplayString}
                </S.MovieInfo>}

                <S.MovieInfo>
                    <S.MovieInfoIcon icon={faClock}/>
                    {length} min
                </S.MovieInfo>

                {imdbUrl && <S.MovieInfo>
                    <S.MovieInfoIcon icon={faLink}/>
                    <a href={imdbUrl! as string} target="_blank" rel="noopener noreferrer">View on IMDB</a>
                </S.MovieInfo>}               

            </Col>
        </S.MovieCardRow>
    </S.MovieCardContainer>
};

export default MovieCard;