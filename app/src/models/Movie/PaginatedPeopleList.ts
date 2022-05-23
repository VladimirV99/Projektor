import Person from './Person';

export default class PaginatedPeopleList {
    constructor(public count: number, public people: Person[]) {}
}
