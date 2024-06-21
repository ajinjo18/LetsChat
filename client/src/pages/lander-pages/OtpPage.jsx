import React from 'react'

import LanderNavbar from '../../components/lander-section/Navbar/LanderNavbar'
import Otp from '../../components/lander-section/Otp/Otp'

const OtpPage = ({role}) => {
  return (
    <div style={{backgroundColor:'black', height:'100vh'}}>
        <LanderNavbar />
        <Otp role={role} />
    </div>
  )
}

export default OtpPage
