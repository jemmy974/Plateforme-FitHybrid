import React from 'react'


import { Outlet } from 'react-router-dom'
import Navbar from '../../partials/home/Navbar'
import Footer from '../../partials/home/Footer'

function HomeLayouts() {
  return (
    <> 
        <Navbar/>
        <Outlet/>   
        <Footer/>   
    </>
    
  )
}

export default HomeLayouts