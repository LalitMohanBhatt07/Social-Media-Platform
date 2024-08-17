import React from 'react'
import Posts from './Posts'

const Feed = () => {
  return (
    <div className='flex-1 my-8 flex flex-col items-center pl-[20%]'>
    {
    [1,2,3,4].map((item,index)=><Posts key={index}/>)
    }
      
    </div>
  )
}

export default Feed
