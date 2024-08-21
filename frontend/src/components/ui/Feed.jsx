import React from 'react'
import Posts from './Posts'
import { useSelector } from 'react-redux'

const Feed = () => {
  const {posts}=useSelector((state)=>state.post)
  return (
    <div className='flex-1 my-8 flex flex-col items-center pl-[20%]'>
    {
    posts.map((post,index)=><Posts key={post._id} post={post}/>)
    }
      
    </div>
  )
}

export default Feed
