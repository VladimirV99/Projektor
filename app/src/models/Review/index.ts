import { userType } from 'redux/auth/models';

export default class Review {
    constructor(
        public reviewer: userType,
        public movieId: number,
        public summary: string,
        public body: string,
        public score: number,
        public createdOn: Date
    ) {}
}
