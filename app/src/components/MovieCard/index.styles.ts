import styled, { css } from 'styled-components';
import { Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const MovieCardContainer = styled.div`
    max-height: 160px;
`;

export const MovieCardRow = styled(Row)`
    height: 100%;
    padding: 5px;
`;

export const MovieCoverImage = styled.img`
    width: 100px;
    height: 100%;
`;

export const MovieTitle = styled.div`
    font-family: arial;
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