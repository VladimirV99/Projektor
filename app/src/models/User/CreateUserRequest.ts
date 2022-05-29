export default class CreateUserRequest {
    constructor(
        public id: number = -1,
        public firstName: string = '',
        public lastName: string = '',
        public email: string = '',
        public password: string = ''
    ) {}
}
