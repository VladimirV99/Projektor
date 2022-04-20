import styled, { css } from 'styled-components';

export const Container = styled.div`
    padding-top: 100px;
    padding-left: 10px;
    padding-right: 10px;
    margin: 0 auto;
    max-width: 800px;
`;

export const MovieListContainer = styled.div<{
    isLoading: boolean;
    isEmpty: boolean;
}>`
    padding-top: 10px;
    padding-bottom: 10px;
    ${(props) =>
        (props.isLoading || props.isEmpty) &&
        css`
            height: 100vh;
        `}
`;

export const MovieFiltersContainer = styled.div``;

export const MovieCardWrapper = styled.div``;
