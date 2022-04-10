import styled, { css } from 'styled-components';
import { Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const MovieCardContainer = styled.div`
    max-height: 160px;
    max-width: 700px;
`;

export const MovieCardRow = styled(Row)`
    height: 100%;
    padding: 5px;
`;

export const MovieCoverImageContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const MovieCoverImage = styled.img`
    width: 100px;
    height: 100px;

    @media (max-width: ${(props) => props.theme.breakpoints.small}) {
        width: 80px;
        height: 80px;
    }
`;

export const MovieTitle = styled.div`
    font-weight: bold;
    font-size: 24px;
    width: 300px;
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

export const MovieYear = styled.div`
    display: inline-block;
    font-weight: bold;
    font-size: 24px;
`;

export const MovieInfo = styled.div`
    display: inline-block;
    font-family: arial;
    font-size: 16px;

    margin-right: 10px;

`;

export const MovieInfoIcon = styled(FontAwesomeIcon)`
    padding-right: 5px;
`;


export { }