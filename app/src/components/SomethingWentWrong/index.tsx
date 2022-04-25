import * as S from './index.styles';

const SomethingWentWrong = () => (
    <S.Container>
        <h1>Something went wrong</h1>
        <div>
            There seems to be an error. Try{' '}
            <S.RefreshButton
                onClick={() => {
                    window.location.reload();
                }}
            >
                refreshing
            </S.RefreshButton>{' '}
            the page.
        </div>
    </S.Container>
);

export default SomethingWentWrong;
