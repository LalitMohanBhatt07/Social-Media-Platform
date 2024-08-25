import React from 'react'
import { useSelector } from 'react-redux'
import Posts from './Posts'

const Feed = () => {
  const {post}=useSelector((state)=>state.post)
  console.log(post)

  if (!Array.isArray(post)) {
    return <p>No posts available</p>;
  }

  return (
    <div className='flex-1 my-8 flex flex-col items-center pl-[20%] select-none'>
    {
      post.map((post)=><Posts key={post._id} Singlepost={post}/>)
    }
      
    </div>
  )
}

export default Feed
