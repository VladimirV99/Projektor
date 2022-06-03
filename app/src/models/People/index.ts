export default class CreateOrUpdatePersonRequest {
    constructor(
        public id: number,
        public firstName: string,
        public lastName: string,
        public imdbUrl: string
    ) {}
}
