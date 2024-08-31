import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { setPosts } from '@/slices/postSlice'
import { setSuggestedUsers } from '@/slices/authSlice'

const useGetSuggestedUsers = () => {
    const dispatch=useDispatch()
 useEffect(()=>{
    const fetchSuggestedUsers=async()=>{
      
        try{
            const res=await axios.get("http://localhost:8000/api/v1/user/suggested",{withCredentials:true})

            console.log('suggested user : ',res)

            if(res.data.success){
                dispatch(setSuggestedUsers(res.data.users))
            }
        }
        catch(err){
            console.log(err)
        }
    }
    fetchSuggestedUsers()
 },[dispatch])
}


export default useGetSuggestedUsers
