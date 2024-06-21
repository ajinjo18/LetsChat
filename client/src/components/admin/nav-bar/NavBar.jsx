import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'


import {darkMode, lightMode} from '../../../utils/themeConfig'

import { useMediaQuery } from 'react-responsive'


const NavBar = () => {
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

    return (
        <nav
        className='navbar navbar-expand-lg'
        style={{ padding: "1rem", border: `1px solid ${colorMode.borderColor}`, backgroundColor: colorMode.cardBackground}}
        >
        <img style={{width:'50px'}} src="/logo.png" alt="" />
        <div style={{ flexGrow: 1 }} />
        <h5 style={{ color: colorMode.text, marginRight:'50px' }}>Admin</h5>
        </nav>
    );

}

export default React.memo(NavBar)
