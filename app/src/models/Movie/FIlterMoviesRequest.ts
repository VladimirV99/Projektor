export default class FilterMoviesRequest {
    constructor(
        public YearFrom : number | null,
        public YearTo: number | null,
        public LengthFrom: number | null,
        public LengthTo: number | null,
        public People: number[] | null,
        public Genres: number[] | null
    ){}
};