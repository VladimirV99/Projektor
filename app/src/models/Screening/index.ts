import Hall from 'models/Hall';
import ScreeningMovie from './ScreeningMovie';

export default class Screening {
    constructor(
        public id: number = -1,
        public movie: ScreeningMovie | null = null,
        public movieStart: string = '',
        public hall: Hall | null = null
    ) {}
}
