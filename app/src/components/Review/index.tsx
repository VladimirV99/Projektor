import StarIcon from 'components/StarIcon';
import Review from 'models/Review';
import { toDateString, toTimeString } from 'util/dateUtils';
import * as S from './index.styles';

type ReviewProps = {
    review: Review;
};

const ReviewBox = ({ review }: ReviewProps): JSX.Element => {
    const { reviewer, summary, body, score, createdOn } = review;
    return (
        <S.ReviewContainer>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                }}
            >
                <S.ReviewSummary>{summary}</S.ReviewSummary>
                <span>
                    <StarIcon active={true} />
                    {score}/10
                </span>
            </div>
            <S.ReviewUser>
                Review by{' '}
                <S.Bold>
                    {reviewer.firstName} {reviewer.lastName}
                </S.Bold>{' '}
                on {toDateString(createdOn)} {toTimeString(createdOn)}
            </S.ReviewUser>

            <p>{body}</p>
        </S.ReviewContainer>
    );
};

export default ReviewBox;
