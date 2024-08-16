import React from 'react'
import { Outlet } from 'react-router-dom'
import LeftSidebar from './ui/LeftSidebar'

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
