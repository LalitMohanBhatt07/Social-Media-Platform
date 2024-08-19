import { Link } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";

const CommentDiscription = ({ open, setOpen }) => {
  const [text,setText]=useState("")

  const changeEventHandler=(e)=>{
    const inputText=e.target.value
    if(inputText.trim()){
      setText(inputText)
    }
    else {setText("")
    }
  }

  const sendMessageHandler=async()=>{
    alert(text)
  }
  return (
    <Dialog open={open}>
      <DialogContent
        className="max-w-5xl p-0 flex flex-col"
        onInteractOutside={() => setOpen(false)}
      >
        <div className="flex flex-1">
          <div className="w-1/2">
            <img
              className="w-full h-full object-cover rounded-lg"
              src="https://images.unsplash.com/photo-1458668383970-8ddd3927deed?w=294&dpr=2&h=294&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxjb2xsZWN0aW9uLXRodW1ibmFpbHx8NDUxfHxlbnwwfHx8fHw%3D"
              alt="Focused Content"
            />
          </div>
          <div className="w-1/2 flex flex-col justify-between">
            <div className="flex items-center justify-between p-4">
              <div className="flex gap-3 items-center">
                <Link>
                  <Avatar>
                    <AvatarImage src="" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </Link>
                <div className="">
                  <Link className="font-semibold text-xs">Username</Link>
                  {/* <span className="text-gray-600 text-sm">Bio here</span> */}
                </div>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <MoreHorizontal className="cursor-pointer" />
                </DialogTrigger>
                <DialogContent className="flex flex-col items-center text-sm text-center">
                  <div className="cursor-pointer w-full text-[#ED4956] font bold">
                    Unfollow
                  </div>
                  <div className="cursor-pointer w-full ">Add to favourite</div>
                </DialogContent>
              </Dialog>
            </div>
            <hr />
            <div className="flex-1 overflow-y-auto max-h-96 p-4">
              Comments Aayenge Comments Aayenge Comments Aayenge Comments
              Aayenge Comments Aayenge Comments Aayenge value
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={text}
                  onChange={changeEventHandler}
                  placeholder="Add a comment ..."
                  className="w-full outline-none border-gray-300 p-4 rounded"
                />
                <Button disabled={!text.trim()} onClick={sendMessageHandler} variant="outline">Send</Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDiscription;
