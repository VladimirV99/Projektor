import { IconButton } from '@mui/material';
import styled from 'styled-components';

export const ReviewContainer = styled.div`
    background-color: white;
    margin: 0.5rem;
    padding: 0.5rem;
    position: relative;
`;

export const ReviewHeader = styled.div`
    display: flex;
    align-items: center;
`;

export const ReviewScore = styled.span`
    margin-right: 0.5rem;
`;

export const ReviewSummary = styled.p`
    font-weight: bold;
    margin-top: 0.1rem;
    margin-bottom: 0.1rem;
    font-size: 14pt;
`;

export const ReviewUser = styled.p`
    font-size: 10pt;
    margin-top: 0;
`;

export const Bold = styled.span`
    font-weight: 600;
`;

export const DeleteReviewButton = styled(IconButton)`
    position: absolute;
    right: 1rem;
    top: 1rem;
`;
