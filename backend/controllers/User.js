const User=require("../models/userModel.js")
import bcrypt from "bcryptjs"

export const register=async(req,res)=>{
    try{
        const {userName,email,password}=req.body
        if(!userName || !email || !password){
            return res.status(401).json({
                success:false,
                message:"All Fields are mandatory"
            })
        }
        const user=await User.findOne({email})
        if(user){
            return res.status(400).json({
                success:false,
                message:"User already exist"
            })
        }

        const hashedPassoword=await bcrypt.hash(password,10)

        await User.create({
            userName,
            email,
            password:hashedPassoword
        })

        return res.status(200).json({
            success:true,
            message:"Account created Successfully"
        })
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"Some error occur during signup of register"
        })
    }
}

export const login=async(req,res)=>{
    try{

    }
    catch(err){
        
    }
}