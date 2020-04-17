import React from 'react';

export default React.createContext({
    token: null,
    userId: null,
    user: null,
    login: (token, userId, tokenExpiration, user) => {},
    logout: () => {}
});
