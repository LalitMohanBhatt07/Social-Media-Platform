import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Heart,
  Home,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUpIcon,
} from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/slices/authSlice";
import CreatePostDialog from "@/components/CreatePostDialog";
import { setPosts, setSelectedPost } from "@/slices/postSlice";




const LeftSidebar = () => {
    const [open,setOpen]=useState(false)
    const dispatch=useDispatch()
    const {user}=useSelector((state)=>state.auth)
    const sidebarItems = [
        { icon: <Home />, text: "Home" },
        { icon: <Search />, text: "Search" },
        { icon: <TrendingUpIcon />, text: "Explore" },
        { icon: <MessageCircle />, text: "Messages" },
        { icon: <Heart />, text: "Notifications" },
        { icon: <PlusSquare />, text: "Create" },
        {
          icon: (
            <Avatar>
              <AvatarImage src={user?.profilePicture?user?.profilePicture:"https://github.com/shadcn.png"} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          ),
          text: "Profile",
        },
        { icon: <LogOut />, text: "Logout" },
      ];
    
    const navigate=useNavigate()

    const [likeNotification,setLikeNotification]=useState(0)

  

    const logoutHandler=async()=>{
        try{
            const res=await axios.get('http://localhost:8000/api/v1/user/logout',{
                withCredentials:true
            })
            console.log(res)

            if(res?.data?.success){
                dispatch(setSelectedPost(null))
                dispatch(setAuthUser(null))
                dispatch(setPosts([]))
                navigate('/login')
                toast.success(res.data.message)
            }
        }
        catch(err){
            toast.err(err.response.data.message)
        }
    }

    const sidebarHandler=(textType)=>{
        if(textType=='Logout'){
            logoutHandler()
        }
        else if(textType=='Create'){
            setOpen(true)
        }
    }
    console.log(open)

  return (
    <div className='fixed top-0 z-10 left-0 px-4 border-r border-gray-300 w-[16%] h-screen'>
            <div className='flex flex-col'>
                <h1 className='my-8 pl-3 font-bold text-xl'>LOGO</h1>
                <div>
                    {
                        sidebarItems.map((item, index) => {
                            return (
                                <div onClick={() => sidebarHandler(item.text)} key={index} className='flex items-center gap-3 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3'>
                                    {item.icon}
                                    <span>{item.text}</span>
                                    {
                                        item.text === "Notifications" && likeNotification.length > 0 && (
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button size='icon' className="rounded-full h-5 w-5 bg-red-600 hover:bg-red-600 absolute bottom-6 left-6">{likeNotification.length}</Button>
                                                </PopoverTrigger>
                                                <PopoverContent>
                                                    <div>
                                                        {
                                                            likeNotification.length === 0 ? (<p>No new notification</p>) : (
                                                                likeNotification.map((notification) => {
                                                                    return (
                                                                        <div key={notification.userId} className='flex items-center gap-2 my-2'>
                                                                            <Avatar>
                                                                                <AvatarImage src={notification.userDetails?.profilePicture} />
                                                                                <AvatarFallback>CN</AvatarFallback>
                                                                            </Avatar>
                                                                            <p className='text-sm'><span className='font-bold'>{notification.userDetails?.username}</span> liked your post</p>
                                                                        </div>
                                                                    )
                                                                })
                                                            )
                                                        }
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                        )
                                    }
                                </div>
                            )
                        })
                    }
                </div>
            </div>

            <CreatePostDialog open={open} setOpen={setOpen}/>
        </div>
  );
};

export default LeftSidebar
