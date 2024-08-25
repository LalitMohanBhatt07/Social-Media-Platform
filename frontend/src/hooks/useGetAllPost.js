import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { setPosts } from '@/slices/postSlice'

const useGetAllPost = () => {
    const dispatch=useDispatch()
 useEffect(()=>{
    const fetchAllPost=async()=>{
      
        try{
            const res=await axios.get("http://localhost:8000/api/v1/post/all",{withCredentials:true})

            if(res.data.success){
                dispatch(setPosts(res.data.posts))
            }
        }
        catch(err){
            console.log(err)
        }
    }
    fetchAllPost()
 },[])
}


export default useGetAllPost
