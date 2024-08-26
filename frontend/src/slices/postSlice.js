import { createSlice } from "@reduxjs/toolkit";

const initialState={
    post:[],
    selectedPost:null,
}

const postSlice=createSlice({
    name:"post",
    initialState:initialState,
    reducers:{
        setPosts:(state,action)=>{
            state.post=action.payload
        },
        setSelectedPost:(state,action)=>{
            state.selectedPost=action.payload
        }
    }
})

export const {setPosts,setSelectedPost}=postSlice.actions
export default postSlice.reducer