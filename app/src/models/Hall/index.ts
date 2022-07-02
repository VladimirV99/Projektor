export default class Hall {
    constructor(public id: number, public name: string) {}
}

export class HallAdmin {
    constructor(
        public id: number,
        public name: string,
        public rows: number,
        public columns: number
    ) {}
}
