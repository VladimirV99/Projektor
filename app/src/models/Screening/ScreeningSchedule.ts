import Screening from 'models/Screening';

export default class ScheduleItem {
    constructor(public key: string, public screenings: Screening[]) {}
}
