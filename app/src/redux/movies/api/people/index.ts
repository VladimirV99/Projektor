import axiosAuthInstance from 'axios/instance';
import {
    CREATE_PERSON_URL,
    DELETE_PERSON_URL,
    SEARCH_PEOPLE_ADMIN_URL,
    UPDATE_PERSON_URL,
} from 'constants/api';
import PaginatedPeopleList from 'models/Movie/PaginatedPeopleList';
import CreateOrUpdatePersonRequest from 'models/People';

export const searchPeopleAdmin = (searchString: string, page: number) => {
    return axiosAuthInstance.get<PaginatedPeopleList>(SEARCH_PEOPLE_ADMIN_URL, {
        params: {
            searchString,
            page,
        },
    });
};

export const createOrUpdatePerson = (person: CreateOrUpdatePersonRequest) => {
    if (person.id !== -1) {
        return axiosAuthInstance.put(UPDATE_PERSON_URL, person);
    } else {
        return axiosAuthInstance.post(CREATE_PERSON_URL, person);
    }
};

export const deletePerson = (id: number) => {
    return axiosAuthInstance.delete(DELETE_PERSON_URL(id));
};
