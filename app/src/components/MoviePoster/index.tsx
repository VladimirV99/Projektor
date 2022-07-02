import Movie from 'models/Movie';
import * as S from './index.styles';

type MoviePosterProps = {
    movie: Movie;
    onClick: () => void;
};

const MoviePoster = ({ movie, onClick }: MoviePosterProps): JSX.Element => {
    const { id, title, year, length, genres, imdbUrl, imageUrl } = movie;

    return (
        <S.PosterContainer onClick={onClick}>
            <S.PosterImg src={imageUrl || '/movie_placeholder.jpg'} />
            <S.PosterTitle>{title}</S.PosterTitle>
        </S.PosterContainer>
    );
};

export default MoviePoster;
