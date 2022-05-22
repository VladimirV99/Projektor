import { faStar } from '@fortawesome/free-solid-svg-icons';
import Review from 'models/Review';
import { toDateString, toTimeString } from 'util/dateUtils';
import * as S from './index.styles';

type ReviewProps = {
    review: Review;
};

const ReviewBox = ({ review }: ReviewProps): JSX.Element => {
    return (
        <S.ReviewContainer>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                }}
            >
                <S.ReviewSummary>{review.summary}</S.ReviewSummary>
                <span>
                    <S.ReviewScoreIcon icon={faStar} />
                    {review.score}/10
                </span>
            </div>
            <S.ReviewUser>
                Review by{' '}
                <S.Bold>
                    {review.reviewer.firstName} {review.reviewer.lastName}
                </S.Bold>{' '}
                on {toDateString(review.createdOn)}{' '}
                {toTimeString(review.createdOn)}
            </S.ReviewUser>

            <p>{review.body}</p>
        </S.ReviewContainer>
    );
};

export default ReviewBox;
