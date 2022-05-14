import axios from 'axios';
import { GET_ROLES_URL } from 'constants/api/movies';
import Role from 'models/Role';

export const getRoles = () => {
    return axios.get<Role[]>(GET_ROLES_URL);
};
