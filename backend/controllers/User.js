import User from "../models/userModel.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import getDataUri from "../Utils/datauri.js"
import cloudinary from "../Utils/cloudinary.js"
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
        const userId=req.params.id
        let user=await User.findById(userId).select('-password')
        console.log(user)
        return res.status(200).json({
            success:true,
            message:"Succefully got Profile",
            user
        })
    }
    catch(err){
        console.log(err)
        return res.status(500).json({
            success:false,
            message:"cannot getProfile of user",
            err
        })
    }
}

export const editProfile=async(req,res)=>{
    try{
        const userId=req.id
        const {bio,gender}=req.body
        const profilePicture=req.file
        let cloudResponse

        if(profilePicture){
            const fileUri=getDataUri(profilePicture)
           cloudResponse= await cloudinary.uploader.upload(fileUri)

        }

        const user=await User.findById(userId).select('-password')
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found"
            })
        }

        if(bio){
            user.bio=bio
        }

        if(gender){
            user.gender=gender
        }

        if(profilePicture){
            user.profilePicture=cloudResponse.secure_url
        }

        await user.save()

        return res.status(200).json({
            success:true,
            message:"Profile Updated successfully",
            user
        })
        
    }
    catch(err){
        clg(err)
        res.status(500).json({
            success:false,
            message:"Cannot get Users profile"
        })
    }
}


export const getSuggestedUser=async(req,res)=>{
    try{
        const suggestedUser=await User.find({_id:{$ne:req.id}}).select("-password")

        if(!suggestedUser){
            return res.status(400).json({
                success:false,
                message:"Cannot get suggested user"
            })
        }
        return res.status(200).json({
            success:"true",
            message:"Successfully got Suggested User",
            users:suggestedUser
        })
    }
    catch(err){
        console.log(err)
        return res.status(500).json({
            success:false,
            message:"Cannot get suggested user",
            err
        })
    }
}

export const followUnfollow=async(req,res)=>{
    try{
        const followKrneWala=req.id
        const jiskoFollowKarunga=req.params.id

        if(followKrneWala ===jiskoFollowKarunga){
            return res.status(400).json({
                success:false,
                message:"You cannot follow or unfollow Yourself"
            })
        }

        const user=await User.findById(followKrneWala)

        const targetUser=await User.findById(
            jiskoFollowKarunga
        )

        if(!user ||!targetUser){
            return res.status(400).json({
                success:false,
                message:"User not found"
            })
        }

        //now we will check wheather we want to follow or unfollow

        const isFollowing=user.following.includes(jiskoFollowKarunga)

        if(isFollowing){
            //unfollow logic
            User.updateOne({_id:followKrneWala},{
                $pull:{
                    following:jiskoFollowKarunga
                }
            })

            User.updateOne({
                _id:jiskoFollowKarunga
            },{
                $pull:{
                    followers:followKrneWala
                }
            })
            return res.status(200).json({
                success:true,
                message:"Unfollowed Successfully",
            })
        }
        else{
            //follow logic 
            await Promise.all([
                User.updateOne({_id:followKrneWala},{
                    $push:{following:jiskoFollowKarunga}
                }),

                User.updateOne({_id:jiskoFollowKarunga},{$push:
                    {followers:followKrneWala}
                })
            ])
            return res.status(200).json({
                success:true,
                message:"followed Successfully",
            })
        }

        
    }
    catch(err){
        console.log(err)
        return res.status(500).json({
            success:false,
            message:"Cannot follow unfollow"
        })
    }
}