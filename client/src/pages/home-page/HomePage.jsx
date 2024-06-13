import React from 'react'

import Home from '../../components/Home/Home'
import NavbarHome from '../../components/navbar/NavbarHome'

const HomePage = ({role}) => {
  
  return (
    <div>
        <NavbarHome />
        <Home role={role} />
    </div>
  )
}

export default HomePage
