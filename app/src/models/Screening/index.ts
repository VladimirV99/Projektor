import ScreeningMovie from './ScreeningMovie';

export default class Screening {
    constructor(
        public id: number,
        public movie: ScreeningMovie | null,
        public movieStart: Date,
        public hallId: number
    ) {}
}
