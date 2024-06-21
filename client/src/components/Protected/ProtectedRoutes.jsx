import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom';
import CircleSpinner from '../spinner/CircleSpinner/CircleSpinner';



const ProtectedRoutes = ({ children }) => {

    const { isAuthenticated, loading } = useSelector(state => state.user);

    if (loading) {
        return <CircleSpinner />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    return children;
};

export default ProtectedRoutes
