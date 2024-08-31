import User from "../models/userModel.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import dotenv, { populate } from "dotenv"
import getDataUri from "../Utils/datauri.js"
import cloudinary from "../Utils/cloudinary.js"
dotenv.config()
import {Post} from '../models/post.js'

export const register = async (req, res) => {
    try {
      const { userName, email, password } = req.body;
  
      // Check if all fields are provided
      if (!userName || !email || !password) {
        return res.status(400).json({
          success: false,
          message: "All fields are mandatory",
        });
      }
  
      // Check if email already exists
      const existingUserByEmail = await User.findOne({ email });
      if (existingUserByEmail) {
        return res.status(400).json({
          success: false,
          message: "User with this email already exists",
        });
      }
  
      // Check if userName already exists
      const existingUserByUsername = await User.findOne({ userName });
      if (existingUserByUsername) {
        return res.status(400).json({
          success: false,
          message: "Username already taken, please choose another",
        });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new user
      await User.create({
        userName,
        email,
        password: hashedPassword,
      });
  
      return res.status(201).json({
        success: true,
        message: "Account created successfully",
      });
    } catch (err) {
      console.error(err); // Log the error for debugging
  
      // Handle duplicate key error explicitly
      if (err.code === 11000) {
        const duplicatedField = Object.keys(err.keyPattern)[0]; // Get the field name that caused the duplicate key error
        return res.status(400).json({
          success: false,
          message: `${duplicatedField} already exists. Please choose a different one.`,
        });
      }
  
      return res.status(500).json({
        success: false,
        message: "Some error occurred during signup",
      });
    }
  };
  
  

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
        const token=await jwt.sign(
            {userId:user._id},
            process.env.SECRET_KEY,
        {expiresIn:`1d`})

        const populatedPosts=await Promise.all(
            user.posts.map(async(postId)=>{
                const post=await Post.findById(postId)
                if(post.author.equals(user._id)){
                    return post
                }
                return null
            })
        )

        user={
            _id:user._id,
            userName:user.userName,
            email:user.email,
            profilePicture:user.profilePicture,
            bio:user.bio,
            followers:user.follower,
            following:user.following,
            posts:populatedPosts
        }

        

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

