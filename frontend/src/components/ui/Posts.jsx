import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Loader2, MoreHorizontal } from "lucide-react";
import { FaHeart } from "react-icons/fa";
import { FiMessageCircle } from "react-icons/fi";
import React, { useState } from "react";
import { IoIosSend } from "react-icons/io";
import { Button } from "@/components/ui/button";
import { CiBookmark } from "react-icons/ci";
import CommentDiscription from "../CommentDescription";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import { setPosts, setSelectedPost } from "@/slices/postSlice";

const Posts = ({ Singlepost }) => {
  console.log("Posts object: ", Singlepost);
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const [loading, setLoading] = useState(false);
  const { post } = useSelector((store) => store.post);

  // Improved initialization with optional chaining
  const [liked, setLiked] = useState(Singlepost.likes?.includes(user?._id) || false);
  const [comment,setComment]=useState(Singlepost.comment || [])
  const [postLike, setPostLike] = useState(Singlepost.likes?.length || 0);
  const dispatch = useDispatch();

  // Log debugging information
  console.log("Singlepost likes array: ", Singlepost.likes);
  console.log("Current user ID: ", user?._id);
  console.log("Initial liked state: ", liked);
  console.log("Initial postLike state: ", postLike);

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    setText(inputText.trim() ? inputText : "");
  };

  const likeOrDislikeHandler = async () => {
    try {
      const action = liked ? 'dislike' : 'like';
      const res = await axios.get(`http://localhost:8000/api/v1/post/${Singlepost._id}/${action}`, { withCredentials: true });
  
      // Log the response for debugging
      console.log("API Response:", res);
  
      // Corrected check for 'success'
      if (res.data && res.data.success) {
        // Update local state based on the response
        const updatedLikes = liked ? postLike - 1 : postLike + 1;
        setPostLike(updatedLikes);
        setLiked(!liked);
  
        // Update global state with the new post data
        const updatedPostData = post.map(p =>
          p._id === Singlepost._id
            ? {
                ...p,
                likes: liked ? p.likes.filter(id => id !== user._id) : [...p.likes, user._id]
              }
            : p
        );
        dispatch(setPosts(updatedPostData));
      } else {
        // If the response does not contain success or it is false
        console.error("Failed API Response:", res.data);
        toast.error("Failed to update like status");
      }
    } catch (error) {
      // Log detailed error information
      console.error("Error during like/dislike operation:", error);
    }
  };
  
  const commentHandlers = async () => {

    // try {
    //     const res = await axios.post(`http://localhost:4000/api/v1/post/${Singlepost._id}/comment`, { text }, {
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         withCredentials: true
    //     });
    //     // console.log(res.data);
    //     // if (res.data.success) {
    //     //     const updatedCommentData = [...comment, res.data.comment];
    //     //     setComment(updatedCommentData);

    //     //     const updatedPostData = post.map(p =>
    //     //         p._id === Singlepost._id ? { ...p, comments: updatedCommentData } : p
    //     //     );

    //     //     dispatch(setPosts(updatedPostData));
    //     //     toast.success(res.data.message);
    //     //     setText("");
    //     // }
    // } catch (error) {
    //     console.log(error);
    // }
}

const commentHandlersNew=(event)=>{
  event.preventDefault()
  toast.success("Hello")
}
  
  const deletePostHandler = async () => {
    try {
      setLoading(true);
      const res = await axios.delete(`http://localhost:8000/api/v1/post/delete/${Singlepost._id}`, { withCredentials: true });

      console.log("Delete response: ", res);

      if (res.data.success) {
        const updatedPost = post.filter((postItem) => postItem?._id !== Singlepost?._id);
        dispatch(setPosts(updatedPost));
        toast.success(res.data.message);
      }
    } catch (err) {
      console.log("Error in delete post handler: ", err);
      toast.error(err.response?.data?.message || "Failed to delete post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-8 w-full max-w-sm mx-auto flex flex-col justify-center">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={Singlepost?.author?.profilePicture} alt="post_image" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <h1 className="ml-2">{Singlepost.author.userName}</h1>
        </div>
        <div>
          <Dialog>
            <DialogTrigger asChild>
              <MoreHorizontal className="cursor-pointer" />
            </DialogTrigger>
            <DialogContent className="flex flex-col items-center text-sm text-center bg-white p-4 rounded shadow-lg">
              <Button variant="ghost" className="cursor-pointer w-fit text-[#ED4956] font-bold">
                Unfollow
              </Button>
              <Button variant="ghost" className="mt-2 cursor-pointer w-fit font-bold border-2 border-black">
                Add to favourites
              </Button>
              {user && user?._id === Singlepost?.author?._id && (
                <Button onClick={deletePostHandler} variant="ghost" className="mt-2 cursor-pointer w-fit font-bold border-2 border-black">
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Delete"}
                </Button>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Image Section */}
      <img className="rounded-md my-2 w-80 aspect-square" src={Singlepost?.image} alt="post_image" />

      {/* Footer Section */}
      <div className="flex items-center justify-between my-2">
        <div className="flex items-center gap-3">
          <FaHeart onClick={likeOrDislikeHandler} size="24" className={`cursor-pointer ${liked ? "text-red-600" : "text-gray-400"}`} />
          <FiMessageCircle className="cursor-pointer hover:text-gray-600" onClick={() =>{
            dispatch(setSelectedPost(Singlepost))
            setOpen((prevState) => !prevState)
          } } />
          <IoIosSend className="cursor-pointer hover:text-gray-600" />
          <CiBookmark className="cursor-pointer hover:text-gray-600 ml-auto" />
        </div>
      </div>
      <span className="font-medium block mb-2">{postLike} likes</span>
      <p>
        <span className="font-medium mr-2">{Singlepost.author.userName}</span>
        {Singlepost.caption}
      </p>
      <span className="cursor-pointer" onClick={() => setOpen((prevState) => !prevState)}>
        View all {
          comment.length
        } comments
      </span>

      <CommentDiscription open={open} setOpen={setOpen} />

      <div className="flex items-center justify-between">
        <input
          className="outline-none text-sm w-full"
          type="text"
          onChange={changeEventHandler}
          value={text}
          placeholder="Add a comment .."
        />
        {text && (
  <button onClick={commentHandlersNew} className="text-[#3BADF8] cursor-pointer bg-transparent border-none">
    Post
  </button>
)}

      </div>
    </div>
  );
};

export default Posts;
