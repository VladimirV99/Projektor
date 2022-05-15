import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

export const Panel = styled(Container)`
    padding: 1rem;
    background-color: #e0e0e0;
`;

export const MovieInfoTable = styled.table`
    width: 100%;
`;

export const MovieTrailerContainer = styled.div`
    text-align: center;
    margin-top: 1rem;
    margin-bottom: 1rem;
`;

export const MoviePoster = styled.img`
    width: 100%;
`;

export const ScreeningDate = styled.h5`
    font-weight: bold;
`;

export const ScreeningItem = styled(Link)`
    display: inline-block;
    text-align: center;
    border: 1px solid black;
    padding: 0.2rem;
    margin: 0.2rem;
    width: 100px;
    background-color: white;
    text-decoration: none;
    color: black;
`;

export const ScreeningItemTime = styled.p`
    font-weight: bold;
    margin-bottom: 2px;
`;

export const ScreeningItemHall = styled.p`
    margin-bottom: 2px;
`;
