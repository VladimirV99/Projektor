export const getUserRoles = () => {
    const accessToken = window.localStorage.getItem('accessToken');

    if (!accessToken) {
        return [];
    }

    const rolesEncoded = JSON.parse(window.atob(accessToken.split('.')[1]))[
        'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
    ];

    const roleArray = rolesEncoded.isArray ? rolesEncoded : [rolesEncoded];

    return roleArray;
};

export const isUserAdmin = () => getUserRoles().includes('Administrator');
