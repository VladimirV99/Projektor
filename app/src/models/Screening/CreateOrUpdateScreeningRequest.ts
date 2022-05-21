import Hall from "models/Hall";
import ScreeningMovie from "./ScreeningMovie";

export default class CreateOrUpdateScreeningRequest {
    constructor(
        public id: number = -1,
        public movie: ScreeningMovie = {
            id: -1,
            title: '',
            length: -1
        },
        public hall: Hall = {
            id: -1,
            name: ''
        },
        public movieStart: Date,
    ) {}
}
