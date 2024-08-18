import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { MoreHorizontal } from "lucide-react";
import { FaHeart } from "react-icons/fa";
import { FiMessageCircle } from "react-icons/fi";
import React,{useState} from "react";
import { IoIosSend } from "react-icons/io";
import { Button } from "@/components/ui/button";
import { CiBookmark } from "react-icons/ci";
import CommentDiscription from "../CommentDescription";



const Posts = () => {
  const [text, setText] = useState("");
  const [open,setOpen]=useState(false)

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };
  return (
    <div className="my-8 w-full max-w-sm mx-auto flex flex-col justify-center">
    
      {/* Header Section */}
      <div className={`flex items-center justify-between`}>
        <div className="flex items-center">
          <Avatar>
            <AvatarImage src="" alt="post_image" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <h1 className="ml-2">Username</h1>
        </div>
        <div>
          <Dialog>
            <DialogTrigger asChild>
              <MoreHorizontal className="cursor-pointer" />
            </DialogTrigger>
            <DialogContent className="flex flex-col items-center text-sm text-center bg-white p-4 rounded shadow-lg">
              <Button
                variant="ghost"
                className="cursor-pointer w-fit text-[#ED4956] font-bold"
              >
                Unfollow
              </Button>
              <Button
                variant="ghost"
                className="mt-2 cursor-pointer w-fit font-bold border-2 border-black"
              >
                Add to favourites
              </Button>
              <Button
                variant="ghost"
                className="mt-2 cursor-pointer w-fit font-bold border-2 border-black"
              >
                Delete
              </Button>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Image Section */}
      <img
        className="rounded-md my-2 w-80 aspect-square"
        src="https://images.unsplash.com/photo-1458668383970-8ddd3927deed?w=294&dpr=2&h=294&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxjb2xsZWN0aW9uLXRodW1ibmFpbHx8NDUxfHxlbnwwfHx8fHw%3D"
        alt="post_image"
      />

      {/* Footer Section */}
      <div className="flex items-center justify-between my-2">
        <div className="flex items-center gap-3" >
          <FaHeart size="24" className="cursor-pointer text-red-600" />
          <FiMessageCircle className="cursor-pointer hover:text-gray-600 group:" onClick={()=>setOpen((prevState)=>!prevState)} />
          <IoIosSend className="cursor-pointer hover:text-gray-600" />
          <CiBookmark className="cursor-pointer hover:text-gray-600 ml-auto" />
        </div>
      </div>
      <span className="font-medium block mb-2">1k likes</span>
      <p>
        <span className="font-medium mr-2">username</span>
        caption
      </p>
      <span className="cursor-pointer" onClick={()=>setOpen((prevState)=>!prevState)}>View all 10 comments</span>
      
        <CommentDiscription open={open} setOpen={setOpen}/>
      
      
      <div className={`flex items-center justify-between '}`}>
        <input
          className="outline-none text-sm w-full"
          type="text"
          onChange={changeEventHandler}
          value={text}
          placeholder="Add a comment .."
        />
        {text && (
          <span
            className="text-[#3BADF8] cursor-pointer"
          >
            Post
          </span>
        )}
      </div>
    </div>
  );
};

export default Posts
