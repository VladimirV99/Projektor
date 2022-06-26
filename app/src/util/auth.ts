import { ROLE_ADMINISTRATOR, ROLE_CUSTOMER } from 'constants/common';

export const getUserRoles = () => {
    const accessToken = window.localStorage.getItem('accessToken');

    if (!accessToken) {
        return [];
    }

    try {
        const rolesEncoded = JSON.parse(window.atob(accessToken.split('.')[1]))[
            'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
        ];

        const roleArray = Array.isArray(rolesEncoded)
            ? rolesEncoded
            : [rolesEncoded];
        return roleArray;
    } catch (err) {
        // If the token is invalid return empty list of roles instead of crashing
        return [];
    }
};

export const isUserAdmin = () => getUserRoles().includes(ROLE_ADMINISTRATOR);

export const isUserCustomer = () => getUserRoles().includes(ROLE_CUSTOMER);

export const userHasRole = (role: string) => getUserRoles().includes(role);
