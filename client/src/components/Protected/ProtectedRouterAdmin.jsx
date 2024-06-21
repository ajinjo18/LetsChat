import React from 'react'

import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom';
import CircleSpinner from '../spinner/CircleSpinner/CircleSpinner';

const ProtectedRouterAdmin = ({children}) => {

    const { isAuthenticated, loading } = useSelector(state => state.isAdmin);


    if (loading) {
        return <CircleSpinner />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/admin" />;
    }

    return children;
}

export default ProtectedRouterAdmin
