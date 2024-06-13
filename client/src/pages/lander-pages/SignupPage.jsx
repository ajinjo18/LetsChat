import React from 'react'

import LanderNavbar from '../../components/lander-section/Navbar/LanderNavbar'
import Signup from '../../components/lander-section/Signup/Signup'

const SignupPage = () => {
  return (
    <div style={{height:'100vh', backgroundColor:'black'}}>
      <div style={{paddingTop:'30px',backgroundColor:'black',paddingLeft:'20px',paddingRight:'20px'}}>
        <LanderNavbar />
        <Signup />
      </div>
    </div>
  )
}

export default SignupPage
