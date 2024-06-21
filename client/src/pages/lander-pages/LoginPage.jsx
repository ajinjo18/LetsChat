import React from 'react'

import LanderNavbar from '../../components/lander-section/Navbar/LanderNavbar'
import Login from '../../components/lander-section/Login/Login'

const LoginPage = () => {

  return (
    <div style={{height:'100vh', backgroundColor:'black'}}>
      <div style={{paddingTop:'30px',backgroundColor:'black',paddingLeft:'20px',paddingRight:'20px'}}>

        <LanderNavbar />
        <Login />

      </div>
    </div>
  )
}

export default LoginPage
