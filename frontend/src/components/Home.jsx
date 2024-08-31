import React from 'react'
import Feed from './ui/Feed'
import { Outlet } from 'react-router-dom'
import RightSidebar from './ui/RightSidebar'
import useGetAllPost from '@/hooks/useGetAllPost'
import useGetSuggestedUsers from '@/hooks/useGetSuggestedUsers'

const Home = () => {
  useGetAllPost()
  useGetSuggestedUsers()
  return (
    <div className='flex'>
    <div className="flex-grow">
      <Feed/>
      <Outlet/>
    </div>
      <RightSidebar/>
    </div>
  )
}

export default Home
