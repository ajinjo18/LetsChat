import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { FaHome } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import { IoAddCircleOutline } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";

import { darkMode, lightMode } from '../../../utils/themeConfig';
import { baseUrl } from '../../../utils/baseUrl';

const Footer = () => {

  const theme = useSelector((state) => state.theme.value);
  const [colorMode, setColorMode] = useState(theme);

  const userData = useSelector(state => state.user.userData)

  useEffect(() => {
    if (theme == "darkMode") {
      setColorMode(darkMode);
    } else {
      setColorMode(lightMode);
    }
  }, [theme]);

  const navigate = useNavigate()

  return (
    <div style={{ backgroundColor: colorMode.cardBackground, color: colorMode.lightText, width: '100vw', height: '8vh', position: 'fixed', bottom: 0, display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
        <FaHome onClick={()=> navigate('/')} style={{ fontSize: '2em' }} />
        <CiSearch onClick={()=> navigate('/search')} style={{ fontSize: '2em' }} />
        <IoAddCircleOutline onClick={()=> navigate('/add-post')} style={{ fontSize: '2em' }} />
        {
          userData?.profilePicture ? (
            <div>
              <img onClick={()=> navigate('/my-profile')} style={{width:'40px'}} src={`${baseUrl}/img/${userData?.profilePicture}`} alt="" />
            </div>
          ) : (
            <CgProfile onClick={()=> navigate('/my-profile')} style={{ fontSize: '2em' }} />
          )
        }
    </div>
  )
}

export default Footer
