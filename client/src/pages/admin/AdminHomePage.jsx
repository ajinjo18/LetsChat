import React from 'react'
import { useSelector } from 'react-redux';

import AdminLogin from '../../components/admin/login/AdminLogin'
import AdminHome from '../../components/admin/home/AdminHome';


const AdminHomePage = ({role}) => {

    const isAdmin = useSelector(state => state.isAdmin.isAuthenticated)

    return (
        <div>
            {
                isAdmin ? <AdminHome role={role} /> : <AdminLogin />
            }
        </div>
    )
}

export default AdminHomePage
