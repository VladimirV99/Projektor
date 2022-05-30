import { Button, TextField } from '@mui/material';
import styled from 'styled-components';

export const ReviewContainer = styled.div`
    background-color: white;
    margin: 0.5rem;
    padding: 0.5rem;
    position: relative;
`;

export const ReviewFormInput = styled(TextField)`
    width: 100%;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
`;

export const ReviewFormScore = styled.div`
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
`;

export const DeleteReviewButton = styled(Button)`
    position: absolute;
    right: 1rem;
    top: 1rem;
`;
