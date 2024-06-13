import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { FaUser } from "react-icons/fa";
import { MdOutlineSecurity } from "react-icons/md";
import { MdBlock } from "react-icons/md";
import { GoBookmarkFill } from "react-icons/go";

import { darkMode, lightMode } from '../../../utils/themeConfig';
import { baseUrl } from '../../../utils/baseUrl';



const UserProfileOptions = () => {

    const userData = useSelector(state => state.user.userData)

    const navigate = useNavigate()

  return (
    <div>
        <div style={{display:'flex'}}>
            <img onClick={()=> navigate('/my-profile')} style={{overflow:'hidden', width:'60px', height:'60px', borderRadius:'50%', marginLeft:'15px', marginTop:'15px', cursor:'pointer'}} src={`${baseUrl}/img/${userData.profilePicture}`} alt="" />
            <h5 style={{marginLeft:'15px', marginTop:'35px', fontSize:'1em'}}>{userData && `${userData.firstName} ${userData.lastName}`}</h5>
        </div>
        <hr style={{width:'90%', marginLeft:'15px'}} />
        <div style={{display:'flex', marginLeft:'30px', marginTop:'20px'}}>
            <FaUser style={{fontSize:'1em'}} /><h6 onClick={()=> navigate('/my-details')} style={{marginLeft:'15px', fontSize:'1em', cursor:'pointer' }}>My Details</h6>
        </div>
        <div style={{display:'flex', marginLeft:'30px', marginTop:'10px'}}>
            <MdOutlineSecurity style={{fontSize:'1em'}} /><h6 onClick={()=> navigate('/security')} style={{marginLeft:'15px', fontSize:'1em', cursor:'pointer' }}>Security</h6>
        </div>
        {/* <div style={{display:'flex', marginLeft:'30px', marginTop:'10px'}}>
            <MdBlock style={{fontSize:'1em', color: colorMode.lightText}} /><h6 style={{marginLeft:'15px', fontSize:'1em', color: colorMode.lightText, cursor:'pointer' }}>Blocked Users</h6>
        </div> */}
        <div style={{display:'flex', marginLeft:'30px', marginTop:'10px'}}>
            <GoBookmarkFill style={{fontSize:'1em'}} /><h6 onClick={()=> navigate('/saved-posts')} style={{marginLeft:'15px', fontSize:'1em', cursor:'pointer' }}>Saved Posts</h6>
        </div>
    </div>
  )
}

export default UserProfileOptions
