export default class Person {
    constructor(
        public id: number,
        public firstName: string,
        public lastName: string,
        public imdbUrl: string,
        public movies: { id: number; title: string }[]
    ) {}
}
