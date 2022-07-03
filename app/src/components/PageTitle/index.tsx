import { Helmet } from 'react-helmet';

type Props = {
    title?: string;
};

const PageTitle = ({ title = '' }: Props) => (
    <Helmet>
        <title>{title === '' ? 'Projektor' : `${title} | Projektor`}</title>
    </Helmet>
);

export default PageTitle;
