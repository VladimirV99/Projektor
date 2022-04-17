import styled from 'styled-components';
import { Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const MovieCardContainer = styled.div`
    max-width: 700px;
    height: 120px;

    &:hover{
        background-image: linear-gradient(315deg, #d9e4f5 0%, #f5e3e6 74%);
    }

    cursor: pointer;
`;

export const MovieCardRow = styled(Row)`
    padding: 5px;
    display: flex;  
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid #e0e0e0;
    width: 100%;
    height: 100%;
`;

export const MovieCardCol = styled(Col)`
    display: flex;  
    align-items: center;
    justify-content: center;
    height: 100%;
`;

export const MovieInfoCol = styled(Col)`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
`;

export const MovieCoverImageContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100px;
    height: 100%;
`;

export const MovieCoverImage = styled.img`
    width: 100%;
    height: 100%;
`;

export const MovieTitle = styled.div`
    font-weight: bold;
    font-size: 24px;
    padding-right: 5px;
    @media (max-width: ${(props) => props.theme.breakpoints.medium}) {
        font-size: 18px;
    }
    max-width: 300px;
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

export const MovieYear = styled.div`
    display: inline-block;
    font-weight: bold;
    font-size: 24px;
    @media (max-width: ${(props) => props.theme.breakpoints.medium}) {
        font-size: 18px;
    }
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