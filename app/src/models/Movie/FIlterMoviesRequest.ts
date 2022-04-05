export default class FilterMoviesRequest {
    constructor(
        public YearFrom : number | null = null,
        public YearTo: number | null = null,
        public LengthFrom: number | null = null,
        public LengthTo: number | null = null,
        public People: number[] | null = null,
        public Genres: number[] | null = null
    ){}
};