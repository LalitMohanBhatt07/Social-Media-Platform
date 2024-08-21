import React, { useState, useRef } from 'react';
import axios from 'axios'; // Make sure to import axios
import { Dialog, DialogTitle, DialogDescription, DialogContent } from './ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { readFileAsDataUrl } from '@/lib/utils';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const CreatePostDialog = ({ open, setOpen }) => {
  const navigate=useNavigate()
  const imageRef = useRef();
  const [file, setFile] = useState("");
  const [caption, setCaption] = useState("");
  const [imagePreview, setImagePreview] = useState(false);
  const [loading, setLoading] = useState(false);

  const fileChangeHandler = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const dataUrl = await readFileAsDataUrl(file);
      setImagePreview(dataUrl);
    }
  };

  const createPostHandler = async (e) => {
    const formData = new FormData();
    formData.append("caption", caption);
    if (imagePreview) {
      formData.append("image", file);
    }
    try {
      setLoading(true)
      const res = await axios.post('http://localhost:8000/api/v1/post/addpost', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true
      });

      if(res.data.success){
        toast.success(res.data.message)
        setOpen(false)
        setFile("")
        setCaption("")
      }

      console.log("response", res);
    } catch (err) {
      toast.error(err.response.data.message);
    }
    finally{
      setLoading(false)
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent aria-describedby="dialog-description" onInteractOutside={() => setOpen(false)}>
        <DialogTitle className='text-center font-bold'>Create New Post</DialogTitle>
        <div id="dialog-description" className="mb-4">
          Fill out the form below to create a new post.
        </div>
        <div className='flex gap-3 items-center'>
          <Avatar>
            <AvatarImage src="" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="">
            <h1 className="font-semibold text-xs">Username</h1>
            <span className="text-gray-600 text-xs">Bio Here...</span>
          </div>
        </div>
        <Textarea value={caption} onChange={(e) => setCaption(e.target.value)} className="focus-visible:ring-transparent border-none" placeholder="Write a caption..." />
        {
          imagePreview && (
            <div className='w-full h-64 flex items-center justify-center'>
              <img className='object-contain h-full w-full rounded-md' src={imagePreview} />
            </div>
          )
        }

        <input ref={imageRef} type='file' className='hidden' onChange={fileChangeHandler} />
        <Button onClick={() => imageRef.current.click()} className='w-fit mx-auto bg-[#0095F6] hover:bg-[#258bcf] '>Select from computer</Button>

        {
          imagePreview && (
            loading ? (
              <div className="newtons-cradle ml-[50%]">
                <div className="newtons-cradle__dot"></div>
                <div className="newtons-cradle__dot"></div>
                <div className="newtons-cradle__dot"></div>
                <div className="newtons-cradle__dot"></div>
              </div>
            ) : (
              <Button onClick={createPostHandler} type="submit" className="w-full">Post</Button>
            )
          )
        }
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostDialog;
