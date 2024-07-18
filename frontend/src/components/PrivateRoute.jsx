import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const PrivateRoute = ({ children, role }) => {
    const { token, role: userRole } = useContext(AppContext);

    if (!token || userRole !== role) {
        return <Navigate to="/login" />;
    }

    return children;
};

export default PrivateRoute;
