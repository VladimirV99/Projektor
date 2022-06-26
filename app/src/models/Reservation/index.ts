export default class Reservation {
    constructor(
        public id: number,
        public screening: {
            id: number;
            movieStart: string;
        },
        public movie: {
            id: number;
            title: string;
        },
        public seats: {
            hallId: number;
            row: number;
            column: number;
            priceMultiplier: number;
        }[],
        public price: number
    ) {}
}
