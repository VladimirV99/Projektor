import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const ReviewContainer = styled.div`
    background-color: white;
    margin: 0.5rem;
    padding: 0.5rem;
`;

export const ReviewScoreIcon = styled(FontAwesomeIcon)`
    color: #cec323;
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
