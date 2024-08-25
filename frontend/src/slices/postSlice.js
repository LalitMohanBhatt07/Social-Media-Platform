import { createSlice } from "@reduxjs/toolkit";

const initialState={
    post:[]
}

const postSlice=createSlice({
    name:"post",
    initialState:initialState,
    reducers:{
        setPosts:(state,action)=>{
            state.post=action.payload
        }
    }
})

export const {setPosts}=postSlice.actions
export default postSlice.reducer