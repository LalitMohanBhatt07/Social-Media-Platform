const User=require("../models/userModel.js")
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

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
        const {email,password}=req.body
        if(!email || !password){
            res.status(401).json({
                success:false,
                message:"All fields are mandatory"
            })
        }
        let user=await User.findOne({email})
        if(!user){
            res.status(401).json({
                success:false,
                message:"Email does not exists"
            })
        }

        const isPasswordMatch=await bcrypt.compare(password,user.password)

        if(!isPasswordMatch){
            return res.status(401).json({
                success:false,
                message:"Password does not match"
            })
        }

        user={
            _id:user._id,
            userName:user.userName,
            email:user.email,
            profilePicture:user.profilePicture,
            bio:user.bio,
            followers:user.followers,
            following:user.following,
            posts:user.posts
        }

        const token=await jwt.sign(
            {userId:user._id},
            process.env.SECRET_KEY,
        {expiresIn:`1d`})

        return res.cookie(`token`,token,{
            httpOnly:true,sameSite:'strict',maxAge:1*24*60*60*1000
        }).json({
            success:true,
            message:`Welcome back ${user.userName}`,
            user
        })
    }
    catch(err){
        console.log(err)
        return res.status(500).json({
            success:false,
            message:"Cannot Login user",
            err
        })
    }
}

export const logout=async(req,res)=>{
    try{
        return res.cookie("token","",{maxAge:0}).json({
            success:true,
            message:"Use logged out successfully"
        })
    }
    catch(err){
        console.log(err)
        return res.status(500).json({
            success:false,
            message:"Cannot logout user",
            err
        })
    }
}

export const getProfile=async(req,res)=>{
    try{
        const userId=req.params._id
        let user=await User.findById(userId)
        return res.status(200).json({
            success:true,
            message:"Succefully got Profile",
            user
        })
    }
    catch(err){
        console.log(err)
    }
}