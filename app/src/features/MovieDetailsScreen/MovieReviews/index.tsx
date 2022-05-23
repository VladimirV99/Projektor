import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Button, CircularProgress } from '@mui/material';
import Review from 'models/Review';
import { Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axiosAuthInstance from 'axios/instance';
import {
    CREATE_REVIEW_URL,
    DELETE_REVIEW_URL,
    GET_REVIEWS_FOR_MOVIE_URL,
    GET_REVIEW_BY_ID_URL,
    UPDATE_REVIEW_URL,
} from 'constants/api/reviews';
import axios from 'axios';
import ReviewBox from 'components/Review';
import { useSelector } from 'react-redux';
import { selectIsUserLoggedIn, selectUser } from 'redux/auth/selectors';
import * as S from './index.styles';
import StarIcon from 'components/StarIcon';
import { parseServerDate } from 'util/dateUtils';

type CreateReviewRequest = {
    isAlreadyCreated: boolean;
    scoreHover: number;
    summary: string;
    body: string;
    score: number;
};

type UserReviewStatus = {
    status: 'idle' | 'pending' | 'success';
    error: string;
};

type UserReviewErrors = {
    summary: string | undefined;
    body: string | undefined;
    score: string | undefined;
};

type Status = 'idle' | 'pending' | 'success' | 'error';

type MovieReviewsProps = {
    movieId: number;
    isMovieLoaded: boolean;
};

const MovieReviews = ({
    movieId,
    isMovieLoaded,
}: MovieReviewsProps): JSX.Element => {
    // Reviews are loaded after the movie
    if (!isMovieLoaded) {
        return <CircularProgress />;
    }

    const isLoggedIn = useSelector(selectIsUserLoggedIn);
    const user = useSelector(selectUser);

    const [reviews, setReviews] = useState<Review[]>([]);
    const [reviewCount, setReviewCount] = useState<number>(0);

    const [userReview, setUserReview] = useState<CreateReviewRequest>({
        isAlreadyCreated: false,
        scoreHover: -1,
        summary: '',
        body: '',
        score: 0,
    });
    const [userReviewStatus, setUserReviewStatus] = useState<UserReviewStatus>({
        status: 'idle',
        error: '',
    });

    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [deleteStatus, setDeleteStatus] = useState<Status>('idle');

    const reviewValidationErrors = useMemo<UserReviewErrors>(() => {
        const errors: UserReviewErrors = {
            summary: undefined,
            body: undefined,
            score: undefined,
        };
        if (userReview.summary.trim().length === 0) {
            errors.summary = 'Summary is required';
        } else if (userReview.summary.trim().length > 50) {
            errors.summary = "Summary can't be longher than 50 characters";
        }
        if (userReview.body.trim().length === 0) {
            errors.body = 'Body is required';
        }
        if (userReview.score === 0) {
            errors.score = 'Score is required';
        } else if (userReview.score > 10) {
            errors.score = 'Score must not be longer than 10';
        }
        return errors;
    }, [userReview]);

    const hasReviewValidationError = useMemo<boolean>(() => {
        return (
            reviewValidationErrors.summary !== undefined ||
            reviewValidationErrors.body !== undefined ||
            reviewValidationErrors.score !== undefined
        );
    }, [reviewValidationErrors]);

    const changeReviewScore = (i: number) => {
        setUserReview({ ...userReview, scoreHover: i });
    };

    const onReviewScoreSelect = (i: number) => {
        setUserReview({ ...userReview, score: i });
    };

    const createReview = () => {
        setUserReviewStatus({
            status: 'pending',
            error: '',
        });
        axiosAuthInstance
            .post<Review>(CREATE_REVIEW_URL, {
                movieId: movieId,
                summary: userReview.summary,
                body: userReview.body,
                score: userReview.score,
            })
            .then((res) => {
                setUserReviewStatus({
                    status: 'success',
                    error: '',
                });
                setUserReview({
                    ...userReview,
                    isAlreadyCreated: true,
                });
                setReviewCount(reviewCount + 1);
            })
            .catch(() => {
                setUserReviewStatus({
                    status: 'idle',
                    error: 'Error creating review',
                });
            });
    };

    const updateReview = () => {
        setUserReviewStatus({
            status: 'pending',
            error: '',
        });
        axiosAuthInstance
            .put<Review>(UPDATE_REVIEW_URL, {
                movieId: movieId,
                summary: userReview.summary,
                body: userReview.body,
                score: userReview.score,
            })
            .then(() => {
                setUserReviewStatus({
                    status: 'success',
                    error: '',
                });
                setReviews(
                    reviews.map((r) => {
                        if (r.reviewer.id !== user.id) return r;
                        return {
                            ...r,
                            score: userReview.score,
                            summary: userReview.summary,
                            body: userReview.body,
                        };
                    })
                );
            })
            .catch((err) => {
                setUserReviewStatus({
                    status: 'idle',
                    error: 'Error updating review',
                });
            });
    };

    const loadReviews = () => {
        axios
            .get(
                GET_REVIEWS_FOR_MOVIE_URL(
                    movieId,
                    reviews.length > 0
                        ? new Date(reviews[reviews.length - 1].createdOn)
                        : null,
                    1
                )
            )
            .then((res) => {
                setReviews(
                    reviews.concat(
                        res.data.reviews.map((r: Review) => {
                            return {
                                ...r,
                                createdOn: parseServerDate(r.createdOn),
                            };
                        })
                    )
                );
                setReviewCount(res.data.count);
            })
            .catch((err) => {});
    };

    const deleteUserReview = () => {
        axiosAuthInstance
            .delete(DELETE_REVIEW_URL(movieId))
            .then(() => {
                setUserReview({
                    ...userReview,
                    isAlreadyCreated: false,
                    score: 0,
                    summary: '',
                    body: '',
                });
                setReviewCount(reviewCount - 1);
                setReviews(reviews.filter((r) => r.reviewer.id !== user.id));
                setDeleteStatus('success');
            })
            .catch(() => {
                setDeleteStatus('error');
            });
    };

    const renderUserReview = useCallback(() => {
        if (!isLoggedIn) {
            // TODO open login panel
            return (
                <S.ReviewContainer>
                    <h5>
                        To leave a review, please{' '}
                        <Link to="/login">log in</Link>
                    </h5>
                </S.ReviewContainer>
            );
        }
        return (
            <S.ReviewContainer>
                <h5>Your Review</h5>

                {userReview.isAlreadyCreated && (
                    <S.DeleteReviewButton
                        onClick={() => {
                            setShowDeleteModal(true);
                        }}
                    >
                        <FontAwesomeIcon icon={faTrash} />
                    </S.DeleteReviewButton>
                )}

                <S.ReviewFormScore>
                    {Array(10)
                        .fill(0)
                        .map((_, i) => {
                            return (
                                <StarIcon
                                    key={i}
                                    active={
                                        userReview.scoreHover != -1
                                            ? i <= userReview.scoreHover
                                            : i < userReview.score
                                    }
                                    onMouseEnter={() => changeReviewScore(i)}
                                    onMouseLeave={() => changeReviewScore(-1)}
                                    onClick={() => onReviewScoreSelect(i + 1)}
                                />
                            );
                        })}
                </S.ReviewFormScore>
                <S.ReviewFormInput
                    label={reviewValidationErrors.summary ?? 'Summary'}
                    error={reviewValidationErrors.summary !== undefined}
                    value={userReview.summary}
                    onChange={(e) =>
                        setUserReview({
                            ...userReview,
                            summary: e.target.value,
                        })
                    }
                />
                <S.ReviewFormInput
                    multiline
                    rows={5}
                    label={reviewValidationErrors.body ?? 'Body'}
                    error={reviewValidationErrors.body !== undefined}
                    value={userReview.body}
                    onChange={(e) =>
                        setUserReview({
                            ...userReview,
                            body: e.target.value,
                        })
                    }
                />

                {userReviewStatus.status === 'success' && (
                    <Alert severity="success">Success</Alert>
                )}

                {userReviewStatus.status === 'idle' &&
                    userReviewStatus.error && (
                        <Alert severity="error">{userReviewStatus.error}</Alert>
                    )}

                {userReview.isAlreadyCreated ? (
                    <Button
                        variant="contained"
                        fullWidth
                        disabled={hasReviewValidationError}
                        onClick={updateReview}
                    >
                        Update
                    </Button>
                ) : (
                    <Button
                        variant="contained"
                        onClick={createReview}
                        fullWidth
                        disabled={hasReviewValidationError}
                    >
                        Post
                    </Button>
                )}

                <Modal show={showDeleteModal}>
                    <Modal.Header>
                        <Modal.Title>Delete review</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {deleteStatus === 'idle' && (
                            <div>
                                Are you sure you want to delete your review?
                                <br />
                                This action cannot be undone.
                            </div>
                        )}
                        {deleteStatus === 'pending' && (
                            <div>Please wait...</div>
                        )}
                        {deleteStatus === 'error' && (
                            <div>Something went wrong. Please try again.</div>
                        )}
                        {deleteStatus === 'success' && (
                            <div>Review successfully deleted</div>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        {(deleteStatus === 'success' ||
                            deleteStatus === 'error') && (
                            <Button
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setDeleteStatus('idle');
                                }}
                            >
                                Close
                            </Button>
                        )}
                        {(deleteStatus === 'idle' ||
                            deleteStatus === 'pending') && (
                            <Fragment>
                                <Button
                                    disabled={deleteStatus === 'pending'}
                                    onClick={() => {
                                        setShowDeleteModal(false);
                                        setDeleteStatus('idle');
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={deleteUserReview}
                                    disabled={deleteStatus === 'pending'}
                                >
                                    Delete
                                </Button>
                            </Fragment>
                        )}
                    </Modal.Footer>
                </Modal>
            </S.ReviewContainer>
        );
    }, [
        isLoggedIn,
        user,
        userReview,
        userReviewStatus,
        reviewValidationErrors,
        hasReviewValidationError,
        showDeleteModal,
        deleteStatus,
    ]);

    const renderReviews = useCallback(() => {
        return (
            <Fragment>
                {reviews.length > 0 ? (
                    <Fragment>
                        {reviews.map((review, i) => {
                            return (
                                <ReviewBox key={i} review={review}></ReviewBox>
                            );
                        })}
                        {reviews.length < reviewCount && (
                            <Button onClick={loadReviews} fullWidth>
                                Load More
                            </Button>
                        )}
                    </Fragment>
                ) : (
                    <h5>There are no reviews for this movie</h5>
                )}
            </Fragment>
        );
    }, [reviews, reviewCount]);

    useEffect(() => {
        loadReviews();
    }, []);

    useEffect(() => {
        if (!isLoggedIn) return;
        // TODO make route [Authorize] or use axios here
        axiosAuthInstance
            .get<Review>(GET_REVIEW_BY_ID_URL(movieId, user.id))
            .then((res) => {
                setUserReview({
                    isAlreadyCreated: true,
                    scoreHover: -1,
                    summary: res.data.summary,
                    body: res.data.body,
                    score: res.data.score,
                });
            })
            .catch((err) => {
                setUserReview({
                    isAlreadyCreated: false,
                    scoreHover: -1,
                    summary: '',
                    body: '',
                    score: 0,
                });
            });
    }, [isLoggedIn]);

    return (
        <Fragment>
            <div>
                <h3>Reviews ({reviewCount})</h3>
            </div>

            {renderUserReview()}
            {renderReviews()}
        </Fragment>
    );
};

export default MovieReviews;
