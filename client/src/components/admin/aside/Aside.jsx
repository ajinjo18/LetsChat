import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { CiLight } from "react-icons/ci";
import { MdDarkMode } from "react-icons/md";

import {darkMode, lightMode} from '../../../utils/themeConfig'
import { toggleTheme } from '../../../redux/admin/themes'

import Logout from '../logout/Logout'
import { useNavigate } from 'react-router-dom';

const Aside = ({role}) => {

    const theme = useSelector(state => state.adminTheme.value)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [colorMode, setColorMode] = useState(theme)

    console.log('aside');



    useEffect(()=>{
        if(theme === 'darkMode'){
            setColorMode(darkMode)
        }
        else{
            setColorMode(lightMode)
        }
    },[theme])

    return (
        <>
          <aside
            className="col-md-2 aside-menu"
            style={{
              backgroundColor: colorMode.cardBackground,
              display: "flex",
              flexDirection: "column",
              height: "100%",
              position: "relative",
              width: "20%",
              borderStyle: "solid",
              borderWidth: "0px 1px 1px 1px",
              borderColor: colorMode.borderColor
            }}
          >
            <h1 style={{marginLeft:'20px', marginTop:'20px', color: colorMode.text}}>Admin</h1>
            <nav style={{ textAlign: 'start', width: "100%" }}>
              <ul style={{ listStyle: "none", padding: 0 }}>
                <li onClick={()=>navigate('/admin')} style={{ backgroundColor: role === 'dashboard' ? colorMode.borderColor : colorMode.bodyBackground, color: colorMode.text, height: "50px", display: "flex", alignItems: "center", margin:'10px', borderRadius:'5px', justifyContent: "center"}}>
                  Dashboard
                </li>
                <li onClick={()=>navigate('/all-users')} style={{ backgroundColor: role === 'showAllUsers' ? colorMode.borderColor : colorMode.bodyBackground, color: colorMode.text, height: "50px", display: "flex", alignItems: "center", margin:'10px', borderRadius:'5px', justifyContent: "center"}}>
                  All Users
                </li>
                <li onClick={()=>navigate('/all-posts')} style={{ backgroundColor: role === 'allPosts' ? colorMode.borderColor : colorMode.bodyBackground, color: colorMode.text, height: "50px", display: "flex", alignItems: "center", margin:'10px', borderRadius:'5px', justifyContent: "center"}}>
                  All Post
                </li>
                <li onClick={()=>navigate('/reported-posts')} style={{ backgroundColor: role === 'reportedPosts' ? colorMode.borderColor : colorMode.bodyBackground, color: colorMode.text, height: "50px", display: "flex", alignItems: "center", margin:'10px', borderRadius:'5px', justifyContent: "center"}}>
                  Reported Posts
                </li>
                {/* <li onClick={()=>navigate('/reported-users')} style={{ backgroundColor: role === 'reportedUsers' ? colorMode.borderColor : colorMode.bodyBackground, color: colorMode.text, height: "50px", display: "flex", alignItems: "center", margin:'10px', borderRadius:'5px', justifyContent: "center"}}>
                  User Report
                </li> */}
              </ul>
            </nav>
    
            <div
              style={{
                backgroundColor: colorMode.cardBackground,
                color: "white",
                marginTop: "auto",
                position: "absolute",
                bottom: 0,
                width: "100%",
                padding: "1rem",
                display: "flex",
                justifyContent: "space-around",
                borderStyle: "solid",
                borderWidth: "1px 0px 0px 0px",
                borderColor: colorMode.borderColor
              }}
            >
              <Logout />
              {/* {
                  theme == 'lightMode' ? <CiLight onClick={() => dispatch(toggleTheme())} style={{color:colorMode.lightText, fontSize:'2em', cursor:'pointer'}} />
                  : <MdDarkMode onClick={() => dispatch(toggleTheme())} style={{color:colorMode.lightText, fontSize:'2em', cursor:'pointer'}} />
              } */}
            </div>
          </aside>
        </>
      );
}

export default Aside




    //   <div onClick={()=>dispatch(showAllUsers())} style={{ color: isActive === 'showAllUsers' ? 'white' : 'black', textAlign: 'center', backgroundColor :  isActive === 'showAllUsers' ? '#03564d' : '#05D8B3' , padding: '20px', borderRadius: '10px', marginTop: '10px' }}>

    // backgroundColor: colorMode.borderColor