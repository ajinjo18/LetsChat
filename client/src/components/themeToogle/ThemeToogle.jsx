import React, { useEffect, useState } from 'react';
import { MdLightMode } from "react-icons/md";
import { MdDarkMode } from "react-icons/md";

import { toggleTheme } from '../../redux/theme/themes';
import { useDispatch, useSelector } from 'react-redux';

import { darkMode, lightMode } from '../../utils/themeConfig';

const ThemeToggle = () => {

    const dispatch = useDispatch()
    const theme = useSelector(state => state.theme.value)


    const [colorMode, setColorMode] = useState(theme)

    useEffect(()=>{
        if(theme == 'darkMode'){
            setColorMode(darkMode)
        }
        else{
            setColorMode(lightMode)
        }
    },[theme])

    
  return (
    <>
        {
            theme == 'lightMode' ? <MdLightMode onClick={() => dispatch(toggleTheme())} style={{color:colorMode.lightText, fontSize:'2em', cursor:'pointer'}} />
            : <MdDarkMode onClick={() => dispatch(toggleTheme())} style={{color:colorMode.lightText, fontSize:'2em', cursor:'pointer'}} />

        }
    </>
  );
};

export default ThemeToggle;
