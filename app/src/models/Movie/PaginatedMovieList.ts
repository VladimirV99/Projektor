import Movie from '.'

export class PaginatedMovieList {
    constructor(public count: number, public movies: Movie[]) {}
}
