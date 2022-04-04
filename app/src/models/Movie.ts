export default class Movie {
    constructor(public Id: number,
                public Title: string,
                public Year: number,
                public Length: number,
                public TrailerUrl: string | null,
                public ImdbUrl: string | null,
                public ImageUrl: string | null,
                public people: { personId: number, name: string}[],
                public genres: { id: number, name: string }[]) {
                    
                }
}

