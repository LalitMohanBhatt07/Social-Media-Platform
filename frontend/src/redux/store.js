import authSlice from "@/slices/authSlice";
import { configureStore } from "@reduxjs/toolkit";

const store=configureStore({
    reducer:{
        //iske andar hum slices rakhenge
        auth:authSlice
    }
})

export default store