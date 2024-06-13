import React, { useEffect, useState } from 'react';
import { TbLogout2 } from "react-icons/tb";

import { isNotAuthenticated } from '../../../redux/admin/isAdminLogged'
import { showDashboard } from '../../../redux/admin/center'
import { useDispatch, useSelector} from 'react-redux';
import { useNavigate } from 'react-router-dom';

import {darkMode, lightMode} from '../../../utils/themeConfig'


const Logout = () => {

    const theme = useSelector(state => state.adminTheme.value)

    const [colorMode, setColorMode] = useState(theme)

    useEffect(()=>{
        if(theme === 'darkMode'){
            setColorMode(darkMode)
        }
        else{
            setColorMode(lightMode)
        }
    },[theme])

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const logoutAdmin = ()=> {
        dispatch(isNotAuthenticated())
        dispatch(showDashboard())
        localStorage.removeItem('adminToken')
        navigate('/admin')
    }

    return (
        <TbLogout2 onClick={logoutAdmin} style={{color:colorMode.lightText, fontSize:'2em', cursor:'pointer'}} />
    );
};

export default React.memo(Logout);
