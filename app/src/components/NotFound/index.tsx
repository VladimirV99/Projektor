import PageTitle from 'components/PageTitle';
import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const NotFound = () => (
    <Fragment>
        <PageTitle title="Not found" />
        <Container>
            <NotFoundContainer>
                <h1>404 Not Found</h1>
                <img src="not_found.png" />
                <Link to="/">Back to home page</Link>
            </NotFoundContainer>
        </Container>
    </Fragment>
);

const Container = styled.div`
    margin: 0 auto;
    width: 70%;
`;

const NotFoundContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
`;

export default NotFound;
