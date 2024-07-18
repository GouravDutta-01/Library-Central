import React, { createContext, useReducer } from 'react';

const initialState = {
    token: localStorage.getItem('token') || '',
    role: localStorage.getItem('role') || '',
};

const AppContext = createContext(initialState);

const appReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN_SUCCESS':
            localStorage.setItem('token', action.payload.token);
            localStorage.setItem('role', action.payload.role);
            return {
                ...state,
                token: action.payload.token,
                role: action.payload.role,
            };
        case 'LOGOUT':
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            return {
                ...state,
                token: '',
                role: '',
            };
        default:
            return state;
    }
};

const AppProvider = ({ children }) => {
    const [state, dispatch] = useReducer(appReducer, initialState);

    const logout = () => {
        dispatch({ type: 'LOGOUT' });
    };

    return (
        <AppContext.Provider value={{ ...state, dispatch, logout }}>
            {children}
        </AppContext.Provider>
    );
};

export { AppContext, AppProvider };
