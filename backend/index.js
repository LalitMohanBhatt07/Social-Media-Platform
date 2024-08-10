import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
const PORT=8080

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



app.get("/",(req,res)=>{
    return res.status(200).json({
        message:"I am Coming from backend",
        success:true
    })
})

app.listen(PORT,()=>{
    console.log(`Server listen at port ${PORT}`)
})