import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import React from 'react'

const Posts = () => {
  return (
    <div className="my-8 w-full mx-w-sm mx-auto">
    <div className="flex items-center justify-between">
    <div className="flex items-center">
    <Avatar>
        <AvatarImage src="" alt="post_image" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <h1>Username</h1>
    </div>
    </div>
      
    </div>
  );
}

export default Posts
