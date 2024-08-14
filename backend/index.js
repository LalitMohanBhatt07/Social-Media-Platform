import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import dotenv from 'dotenv'
dotenv.config()
import connectDb from "./Utils/db.js"
import userRoute from "./routes/userRote.js"

const app=express()
//middlewares
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended:true}))
const corsOption={
    origin:`http://localhost:5173`,
    credentials:true
}

app.use(cors(corsOption))

app.use("/api/v1/user",userRoute)

const PORT=process.env.PORT||4000

app.get("/",(req,res)=>{
    return res.status(200).json({
        message:"I am Coming from backend",
        success:true
    })
})

app.listen(PORT,()=>{
    connectDb()
    console.log(`Server listen at port ${PORT}`)
})