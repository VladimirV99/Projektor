import React from 'react';
import Movie from '@models/Movie'

type MovieCardProps = {
    movie: Movie;
}

const MovieCard = ({ movie } : MovieCardProps) : JSX.Element => {
    return <pre>{JSON.stringify(movie, null, 2)}</pre>
};

export default MovieCard;