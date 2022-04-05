export default class Movie {
    constructor(public Id: number,
                public Title: string,
                public Year: number,
                public Length: number,
                public TrailerUrl: string | null,
                public ImdbUrl: string | null,
                public ImageUrl: string | null,
                public People: { personId: number, name: string}[],
                public Genres: { id: number, name: string }[]) {
                    
                }
}

