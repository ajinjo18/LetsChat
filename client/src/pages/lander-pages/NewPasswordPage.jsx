import React from 'react'

import LanderNavbar from '../../components/lander-section/Navbar/LanderNavbar'
import NewPassword from '../../components/lander-section/NewPassword/NewPassword'

const NewPasswordPage = () => {
  return (
    <div style={{backgroundColor:'black', height:'100vh'}}>
        <LanderNavbar />
        <NewPassword />
    </div>
  )
}

export default NewPasswordPage
