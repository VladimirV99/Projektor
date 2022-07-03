import styled from 'styled-components';

export const PosterContainer = styled.div`
    display: flex;
    flex-direction: column;
    border: 1px solid black;
    max-width: 200px;
    margin: 10px;
    cursor: pointer;
`;

export const PosterImg = styled.img`
    width: 100%;
`;

export const PosterTitle = styled.p`
    text-align: center;
    margin: 0;
    padding: 5px;
    font-size: 1.1em;
`;
