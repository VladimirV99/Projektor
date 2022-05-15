export default class Movie {
    constructor(
        public id: number,
        public title: string,
        public year: number,
        public length: number,
        public trailerUrl: string | null,
        public imdbUrl: string | null,
        public imageUrl: string | null,
        public people: { personId: number; name: string; role: string }[],
        public genres: { id: number; name: string }[]
    ) {}
}
