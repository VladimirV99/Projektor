import { Fragment, useState } from 'react';
import Movie from 'models/Movie';
import ModalCheKoV from 'components/Modal';
import styled from 'styled-components';
import { TextField } from '@mui/material';

type Props = {
    movie: Movie;
    onClose: () => void;
};

const CreateOrEditMovie = (
    { movie, onClose }: Props = { movie: new Movie(), onClose: () => {} }
) => {
    const [movieInput, setMovieInput] = useState({ ...movie });

    return (
        <ModalCheKoV shouldRender={true} onModalClose={onClose}>
            <ModalContainer>
                {movie.id != -1 ? (
                    <h4>
                        Editing: <i>{movie.title}</i> ({movie.year})
                    </h4>
                ) : (
                    <FormInputFieldTitle>
                        Create a new movie
                    </FormInputFieldTitle>
                )}
                <hr />
                <div>
                    <FormInputFieldTitle>Title</FormInputFieldTitle>
                    <TextField
                        value={movieInput.title}
                        onChange={(e) => {
                            setMovieInput({
                                ...movieInput,
                                title: e.target.value,
                            });
                        }}
                        fullWidth
                    />
                </div>
                <div>
                    <FormInputFieldTitle>Year</FormInputFieldTitle>
                    <TextField
                        value={movieInput.year}
                        type="number"
                        onChange={(e) =>
                            setMovieInput({
                                ...movieInput,
                                year: parseInt(e.target.value, 10),
                            })
                        }
                        fullWidth
                    />
                </div>
                <div>
                    <FormInputFieldTitle>Length (minutes)</FormInputFieldTitle>
                    <TextField
                        value={movieInput.length}
                        type="number"
                        onChange={(e) =>
                            setMovieInput({
                                ...movieInput,
                                length: parseInt(e.target.value, 10),
                            })
                        }
                        fullWidth
                    />
                </div>
                <div>
                    <FormInputFieldTitle>Trailer URL</FormInputFieldTitle>
                    <TextField
                        value={movieInput.trailerUrl}
                        onChange={(e) => {
                            setMovieInput({
                                ...movieInput,
                                trailerUrl: e.target.value,
                            });
                        }}
                        fullWidth
                    />
                </div>
                <div>
                    <FormInputFieldTitle>Imdb URL</FormInputFieldTitle>
                    <TextField
                        value={movieInput.imdbUrl}
                        onChange={(e) => {
                            setMovieInput({
                                ...movieInput,
                                imdbUrl: e.target.value,
                            });
                        }}
                        fullWidth
                    />
                </div>
                <div>
                    <FormInputFieldTitle>People</FormInputFieldTitle>
                </div>
                <div>
                    <FormInputFieldTitle>Genres</FormInputFieldTitle>
                </div>
            </ModalContainer>
        </ModalCheKoV>
    );
};

export default CreateOrEditMovie;

const ModalContainer = styled.div`
    background-color: white;
    padding-left: 10px;
    padding-right: 10px;
    width: 600px;
`;

const FormInputFieldTitle = styled.div`
    font-size: 20px;
    font-weight: bold;
`;
