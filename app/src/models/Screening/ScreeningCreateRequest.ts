export default class ScreeningCreateRequest {
    constructor(
        public movieId: number = -1,
        public movieStart: string = '',
        public hallId: number = -1
    ) {}
}
