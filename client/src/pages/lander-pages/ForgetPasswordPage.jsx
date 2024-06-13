import React from 'react'

import LanderNavbar from '../../components/lander-section/Navbar/LanderNavbar'
import ForgetPassword from '../../components/lander-section/ForgetPassword/ForgetPassword'

const ForgetPasswordPage = () => {
  return (
    <div style={{backgroundColor:'black', height:'100vh'}}>
        <LanderNavbar />
        <ForgetPassword />
    </div>
  )
}

export default ForgetPasswordPage
