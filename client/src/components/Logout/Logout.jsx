import React from 'react'

import { CiLogout } from "react-icons/ci";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { setIsNotAuthenticated } from '../../redux/user/user'
// import { removeSocketId } from '../../redux/socketIO/socketIO';


const Logout = () => {

  const dispatch = useDispatch()
  const navigate = useNavigate()

  // const socketId = useSelector(state => state.socketId.value);

  const logoutFun = () => {
    // socketId.disconnect()
    // dispatch(removeSocketId())
    dispatch(setIsNotAuthenticated())
    navigate('/')
  }

  return (
    <div style={{marginTop:'10px', display:'flex', justifyContent:'center'}}>
      <CiLogout style={{fontSize:'1.5em'}} /> <h6 onClick={logoutFun} style={{marginLeft:'5px', cursor:'pointer'}}>Logout</h6>
    </div>
  )
}

export default Logout
