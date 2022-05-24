export default class Person {
    constructor(
        public id: number = -1,
        public firstName: string = '',
        public lastName: string = '',
        public imdbUrl: string = '',
        public movies: { id: number; title: string }[] = []
    ) {}
}
