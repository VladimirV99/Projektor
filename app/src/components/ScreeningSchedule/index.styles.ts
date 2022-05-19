import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const ScheduleKey = styled.h5`
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
