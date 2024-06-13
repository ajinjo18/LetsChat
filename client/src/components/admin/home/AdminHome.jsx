import React from 'react'

import NavBar from '../nav-bar/NavBar'
import Aside from '../aside/Aside'
import Center from '../center/Center'

const AdminHome = ({role}) => {


    return (

        <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh"
      }}
    >
      <NavBar />
      <div
        style={{
          display: "flex",
          flexGrow: 1,
          height: "100%"
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            height: "100%",
            width: "100%"
          }}
        >
        <Aside role={role} />
        <Center role={role} />
        </div>
      </div>
    </div>

    )
}

export default AdminHome
