import { Post } from "../models/post.js"
import sharp from "sharp"
import cloudinary from "../Utils/cloudinary.js"
import User from "../models/userModel.js"
import Comment from "../models/comment.js"

export const addNewPost=async(req,res)=>{
    try{
        const userId=req.id
        const {caption}=req.body
        const image=req.file

        if(image){
            return res.status(400).json({
                success:false,
                message:"Image Required"
            })
        }

        //image upload
        const optimizedImageBuffer=await sharp(image.buffer).resize({width:800,height:800,fit:"inside"} )
        .toFormat('jpeg',{quality:80})
        .toBuffer()

        //buffer to data uri
        const fileUri=`data:image/jpeg:base64,${optimizedImageBuffer.toString('base64')}`

        const cloudResponse=await cloudinary.uploader.upload(fileUri)

        const post=await Post.create({
            caption,
            image:cloudResponse.secure_url,
            author:userId
        })
        const user=await User.findById(userId)
        if(user){
            user.posts.push(post._id)
            await user.save()
        }
        
        await post.populate({path:'author',select:'-password'})

        return res.status(200).json({
            success:true,
            message:"Successfully created post",post
        })
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"Cannot create course",
            err
        })
    }

}

export const getAllPost=async(req,res)=>{
    try{
        const posts=await Post.find().sort({createdAt:-1}).populate({path:'author',select:'userName,profilePicture'})
        .populate({
            path:'comments',
            sort:{createdAt:-1}
            .populate({
                path:'author',
                select:'userName,profilePicture'
            })
        })

        return res.status(200).json({
            success:true,
            message:"Succesfully got all the post",
            posts
        })
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"Cannot get all Posts",
            err
        })
    }
}

export const getUserPost=async(req,res)=>{
    try{
        const userId=req.id
        const posts=await Post.find({author:userId}).sort({createdAt:-1}).populate({
            path:"author",
            select:"userName,profilePicture"
        })
        .populate({
            path:"comments",
            sort:{createdAt:-1},
            populate:{
                path:"author",
                select:"userName,profilePicture"
            }
        })

        return res.status(200).json({
            success:true,
            message:"Successfully fetched users posts",
            posts
        })
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Cannot fetch users posts",
            
        })
    }
}

export const likePost=async(req,res)=>{
    try{
        const likeKarneWaleUserKiId=req.id
        const postId=req.params.id

        const post=await Post.findById(postId)
        if(!post){
            return res.status(404).json({
                success:false,
                message:"Post not found"
            })
        }

        // like logic started
        //hamne post.likes.push() method ka use isliye nahi kara kyonki ek user sirf ek hi baar like kar sakta h
        await post.updateOne({$addToSet:{likes:likeKarneWaleUserKiId}})
        await post.save()

        //implementing socket io for real time notification
        return res.status(200).json({
            succes:true,
            message:"Successfully like post",
            post
        })
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Cannot like post"
        })
    }
}

export const dislikePost=async(req,res)=>{
    try{
        const likeKarneWaleUserKiId=req.id
        const postId=req.params.id

        const post=await Post.findById(postId)
        if(!post){
            return res.status(404).json({
                success:false,
                message:"Post not found"
            })
        }

        // like logic started
        //hamne post.likes.push() method ka use isliye nahi kara kyonki ek user sirf ek hi baar like kar sakta h
        await post.updateOne({$pull:{likes:likeKarneWaleUserKiId}})
        await post.save()

        //implementing socket io for real time notification
        return res.status(200).json({
            succes:true,
            message:"Successfully disliked post",
            post
        })
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Cannot dislike post"
        })
    }
}

export const addComment=async(req,res)=>{
    try{
        const postId=req.params.id
        const commentKarneWaleUserKiId=req.id
        const {text}=req.body

        const post=await Post.findById(postId)
        if(!text){
            return res.status(400).json({
                success:false,
                message:"text is required"
            })
        }

        const comment=await Comment.create({
            text,
            author:commentKarneWaleUserKiId,
            post:postId
        }).populate({
            path:'author',
            select:"userName,profilePicture"
        })

        post.comments.push(comment._id)

        await post.save()

        return res.status(200).json({
            success:true,
            message:"successfully created comment",
            comment
        })
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Failed to create comment",
            
        })
    }
}



