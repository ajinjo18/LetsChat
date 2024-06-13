import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import AllUsers from '../allusers/AllUsers'
import {darkMode, lightMode} from '../../../utils/themeConfig'
import AllPosts from '../all-posts/AllPosts'
import Dashboard from '../dashboard/Dashboard'
import PostReport from '../post-report/PostReport'
import UserReport from '../user-report/UserReport'


const Center = ({role}) => {

    const theme = useSelector(state => state.adminTheme.value)

    const [colorMode, setColorMode] = useState(theme)

    console.log('center', role);


    useEffect(()=>{
        if(theme === 'darkMode'){
            setColorMode(darkMode)
        }
        else{
            setColorMode(lightMode)
        }
    },[theme])

        return (
            <main
            className="col-md-10 dashboard-content"
            style={{ backgroundColor: colorMode.bodyBackground, padding: "20px", width: "80%" }}
          >
            <div style={{padding:'20px', backgroundColor: colorMode.cardBackground, height: "100%", width: "100%", borderRadius:'10px', border: `1px solid ${colorMode.borderColor}`}}>
            {
                role === 'dashboard' && (
                    <Dashboard />
                )
            }

            {
                role === 'showAllUsers' && (
                    <AllUsers />
                )
            }

            {
                role === 'allPosts' && (
                    <>
                        <h5 style={{color:'black'}}>All Posts</h5>
                        <div className='col-6' style={{textAlign:'center', marginRight: 'auto', marginLeft:'auto', maxHeight: '400px', overflowY: 'auto'}}>
                            <AllPosts />
                        </div>
                    </>
                )
            }

            {
                role === 'reportedPosts' && (
                    <>
                        <h5 style={{color:'black'}}>Reported Posts</h5>
                        {/* <div className='col-6' style={{textAlign:'center', marginRight: 'auto', marginLeft:'auto', maxHeight: '400px', overflowY: 'auto'}}> */}
                            <PostReport />
                        {/* </div> */}
                    </>
                )
            }

            {
                role === 'reportedUsers' && (
                    <>
                        <h5 style={{color:'black'}}>Reported Users</h5>
                        {/* <div className='col-6' style={{textAlign:'center', marginRight: 'auto', marginLeft:'auto', maxHeight: '400px', overflowY: 'auto'}}> */}
                            {/* <UserReport /> */}
                        {/* </div> */}
                    </>
                )
            }

            </div>
            {/* <h1>dahbord</h1>Dashboard content from the context goes here */}
          </main>
        )

    // if(role === 'allPosts'){

    //     return (
    //         <main
    //         className="col-md-10 dashboard-content"
    //         style={{ backgroundColor: colorMode.bodyBackground, padding: "20px", width: "80%" }}
    //       >
    //         <div style={{padding:'20px', backgroundColor: colorMode.cardBackground, height: "100%", width: "100%", borderRadius:'10px', border: `1px solid ${colorMode.borderColor}`}}>

    //         <AllUsers />
    //         </div>
    //         {/* <h1>dahbord</h1>Dashboard content from the context goes here */}
    //       </main>
    //     )
    // }

    // if(role === 'allPosts'){
    //     <main
    //         className="col-md-10 dashboard-content"
    //         style={{ backgroundColor: colorMode.bodyBackground, padding: "20px", width: "80%" }}
    //       >
    //         <div style={{padding:'20px', backgroundColor: colorMode.cardBackground, height: "100%", width: "100%", borderRadius:'10px', border: `1px solid ${colorMode.borderColor}`}}>

    //         <AllPosts />
    //         </div>
    //         {/* <h1>dahbord</h1>Dashboard content from the context goes here */}
    //       </main>
    // }

}

export default Center
