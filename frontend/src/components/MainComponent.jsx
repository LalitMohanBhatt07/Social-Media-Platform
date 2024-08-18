import React from 'react'
import { Outlet } from 'react-router-dom'
import LeftSidebar from '../Pages/LeftSidebar'

const MainComponent = () => {
  return (
    <div>
    <LeftSidebar/>
    <div className="">
    <Outlet/>
    </div>
      
    </div>
  )
}

export default MainComponent
