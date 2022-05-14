export default class Movie {
    constructor(
        public id: number = -1,
        public title: string = '',
        public year: number = 0,
        public length: number = 0,
        public trailerUrl: string | null = '',
        public imdbUrl: string | null = '',
        public imageUrl: string | null = '',
        public people: { personId: number; name: string }[] = [],
        public genres: { id: number; name: string }[] = []
    ) {}
}
