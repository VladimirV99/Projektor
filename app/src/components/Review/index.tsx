import StarIcon from 'components/StarIcon';
import Review from 'models/Review';
import { toDateString, toTimeString } from 'util/dateUtils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { isUserAdmin } from 'util/auth';
import * as S from './index.styles';

type ReviewProps = {
    review: Review;
    onRemoveClick: (userId: string) => void;
};

const ReviewBox = ({ review, onRemoveClick }: ReviewProps): JSX.Element => {
    const { reviewer, summary, body, score, createdOn } = review;
    const isAdmin = isUserAdmin();
    return (
        <S.ReviewContainer>
            <S.ReviewHeader>
                <S.ReviewScore>
                    <StarIcon active={true} />
                    {score}/10
                </S.ReviewScore>
                <S.ReviewSummary>{summary}</S.ReviewSummary>
            </S.ReviewHeader>
            {isAdmin && (
                <S.DeleteReviewButton
                    onClick={() => {
                        onRemoveClick(reviewer.id);
                    }}
                >
                    <FontAwesomeIcon icon={faTrash} />
                </S.DeleteReviewButton>
            )}
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
