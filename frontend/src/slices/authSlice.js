
import { createSlice } from "@reduxjs/toolkit";

const initialState={
    user:null,
    suggestedUser:[]
}

const authSlice=createSlice({
    name:"auth",
    initialState:initialState,
    reducers:{
        setAuthUser:(state,action)=>{
            state.user=action.payload
        },
        setSuggestedUsers:(state,action)=>{
            state.suggestedUser=action.payload
        }
    }
})

export const {setAuthUser,setSuggestedUsers}=authSlice.actions
export default authSlice.reducer