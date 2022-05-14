import { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import SearchInput from './SearchInput';
import { SEARCH_PEOPLE_URL } from 'constants/index';
import SelectedOptions from './SelectedOptions';
import FilterMoviesRequest from 'models/Movie/FilterMoviesRequest';
import { filterMovies } from 'redux/movies/reducers/Movie';
import useAsyncError from 'hooks/useAsyncError';
import { useDispatch, useSelector } from 'react-redux';
import Movie from 'models/Movie';
import * as selectors from 'redux/movies/selectors';
import MovieCard from 'components/MovieCard';
import CreateOrEditMovie from './CreateOrEditMovie';
import styled from 'styled-components';

const AdminDashboard = () => {
    // const [selectedOptions, setSelectedOptions] = useState<any[]>([]);
    const [filterMovieRequest, setFilterMovieRequest] =
        useState<FilterMoviesRequest>(new FilterMoviesRequest());

    const throwAsyncError = useAsyncError();
    const dispatch = useDispatch();
    const movies: Movie[] = useSelector(selectors.getMovies);
    const moviesStatus = useSelector(selectors.getMoviesStatus);
    const moviesCount = useSelector(selectors.getMoviesCount);

    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

    useEffect(() => {
        dispatch(filterMovies(filterMovieRequest));
    }, [filterMovieRequest, dispatch]);

    return (
        <Container>
            {movies.map((movie) => (
                <MovieCard
                    movie={movie}
                    onClick={() => setSelectedMovie(movie)}
                />
            ))}
            {selectedMovie && (
                <CreateOrEditMovie
                    movie={selectedMovie}
                    onClose={() => setSelectedMovie(null)}
                />
            )}
            {/* <SearchInput
                searchEndpoint={SEARCH_PEOPLE_URL}
                getOptions={(results) => {
                    return results.map((result) => {
                        return {
                            id: result.id,
                            label: `${result.firstName} ${result.lastName}`,
                        };
                    });
                }}
                onOptionClicked={({ id, label }) => {
                    if (selectedOptions.find((option) => option.id === id)) {
                        return;
                    }
                    setSelectedOptions([...selectedOptions, { id, label }]);
                }}
            />
            <SelectedOptions
                options={selectedOptions}
                direction={'column'}
                onDelete={(id) => {
                    setSelectedOptions(
                        selectedOptions.filter((option) => option.id !== id)
                    );
                }}
            /> */}
        </Container>
    );
};

export default AdminDashboard;
