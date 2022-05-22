import urlJoin from 'url-join';
import { addMillisecond } from 'util/dateUtils';
import URL_BASE from '../global';

export const GET_REVIEW_BY_ID_URL = (movieId: number, userId: string) =>
    urlJoin(
        URL_BASE,
        '/Review/GetReview',
        `?movieId=${movieId}&reviewerId=${userId}`
    );

export const GET_REVIEWS_FOR_MOVIE_URL = (
    movieId: number,
    createdAfter: Date | null,
    perPage: number | null
) => {
    let url = urlJoin(
        URL_BASE,
        '/Review/GetReviewsForMovie',
        `?movieId=${movieId.toString()}`
    );
    // Postgres uses nanoseconds so we add one millisecond in order to
    // not get the same review twice
    if (createdAfter != null)
        url = urlJoin(
            url,
            `&createdAfter=${addMillisecond(createdAfter).toISOString()}`
        );
    if (perPage != null) url = urlJoin(url, `&perPage=${perPage}`);
    return url;
};

export const CREATE_REVIEW_URL = urlJoin(URL_BASE, '/Review/CreateReview');

export const UPDATE_REVIEW_URL = urlJoin(URL_BASE, '/Review/UpdateReview');

export const DELETE_REVIEW_URL = (movieId: number) =>
    urlJoin(URL_BASE, '/Review/DeleteReview', movieId.toString());

export const REMOVE_REVIEW_URL = (movieId: number, userId: string) =>
    urlJoin(
        URL_BASE,
        '/Review/RemoveReview',
        `?movieId=${movieId}&reviewerId=${userId}`
    );
