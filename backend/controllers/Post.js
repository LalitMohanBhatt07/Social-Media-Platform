import { Post } from "../models/post.js"
import sharp from "sharp"
import cloudinary from "../Utils/cloudinary.js"
import User from "../models/userModel.js"
import { Comment } from "../models/comment.js"
import e from "express"

export const addNewPost=async(req,res)=>{
    try {
        const { caption } = req.body;
        const image = req.file;
        const authorId = req.id;

        if (!image) return res.status(400).json({ message: 'Image required' });

        // image upload 
        const optimizedImageBuffer = await sharp(image.buffer)
            .resize({ width: 800, height: 800, fit: 'inside' })
            .toFormat('jpeg', { quality: 80 })
            .toBuffer();

        // buffer to data uri
        const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString('base64')}`;
        const cloudResponse = await cloudinary.uploader.upload(fileUri);
        const post = await Post.create({
            caption,
            image: cloudResponse.secure_url,
            author: authorId
        });
        const user = await User.findById(authorId);
        if (user) {
            user.posts.push(post._id);
            await user.save();
        }

        await post.populate({ path: 'author', select: '-password' });

        return res.status(201).json({
            message: 'New post added',
            post,
            success: true,
        })

    } catch (error) {
        console.log(error);
    }

}

export const getAllPost=async(req,res)=>{
    try {
        const posts = await Post.find().sort({ createdAt: -1 }).populate({ path: 'author', select: 'userName profilePicture' })
            .populate({
                path: 'comments',
                sort: { createdAt: -1 },
                populate: {
                    path: 'author',
                    select: 'userName profilePicture'
                }
            });
        return res.status(200).json({
            posts,
            success: true
        })
    } catch (error) {
        console.log(error);
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

export const likePost = async (req, res) => {
    try {
      const likeKarneWaleUserKiId = req.id;
      const postId = req.params.id;
  
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({
          success: false,  // Correct spelling
          message: "Post not found"
        });
      }
  
      // Like logic started
      // Using $addToSet to ensure a user can like a post only once
      await post.updateOne({ $addToSet: { likes: likeKarneWaleUserKiId } });
      await post.save();
  
      // Return success response
      return res.status(200).json({
        success: true,  // Correct spelling
        message: "Successfully liked post",
        post
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Cannot like post"
      });
    }
  };
  

export const dislikePost = async (req, res) => {
    try {
      const likeKarneWaleUserKiId = req.id;
      const postId = req.params.id;
  
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({
          success: false,  // Correct spelling
          message: "Post not found"
        });
      }
  
      // Dislike logic started
      // Using $pull to remove the user's ID from the likes array
      await post.updateOne({ $pull: { likes: likeKarneWaleUserKiId } });
      await post.save();
  
      // Return success response
      return res.status(200).json({
        success: true,  // Correct spelling
        message: "Successfully disliked post",
        post
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Cannot dislike post"
      });
    }
  };
  

  export const addComment = async (req, res) => {
    try {
      const postId = req.params.id;
      const commentKarneWaleUserKiId = req.id;
      const { text } = req.body;
  
      if (!text) {
        return res.status(400).json({
          success: false,
          message: "Text is required"
        });
      }
  
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({
          success: false,
          message: "Post not found"
        });
      }
  
      // Create the comment
      const comment = await Comment.create({
        text,
        author: commentKarneWaleUserKiId,
        post: postId
      });
  
      // Populate the comment author using a separate query
      const populatedComment = await Comment.findById(comment._id)
        .populate({
          path: 'author',
          select: 'userName profilePicture'
        });
  
      post.comments.push(comment._id);
      await post.save();
  
      return res.status(200).json({
        success: true,
        message: "Successfully created comment",
        comment: populatedComment
      });
    } catch (err) {
      console.error("Error in addComment:", err.message || err);
      return res.status(500).json({
        success: false,
        message: "Failed to create comment",
        error: err.message || err
      });
    }
  };
  

export const getCommentsOfPost=async(req,res)=>{
    try{
        const postId=req.params.id

        const comments=await Comment.find({post:postId}).populate('author','username','profilePicture')

        if(!comments){
            return res.status(404).json({
                success:false,
                message:"No comments found"
            })
        }

        return res.status(200).json({
            success:true,
            message:"Successfully fetched comments of post",
            comments
        })
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"Failed to fetch comments of post",
        })
    
    }
}

export const deletePost=async(req,res)=>{
    try {
        const postId = req.params.id;
        const authorId = req.id;

        const post = await Post.findById(postId);
        if(!post) return res.status(404).json({message:'Post not found', success:false});

        // check if the logged-in user is the owner of the post
        if(post.author.toString() !== authorId) return res.status(403).json({message:'Unauthorized'});

        // delete post
        await Post.findByIdAndDelete(postId);

        // remove the post id from the user's post
        let user = await User.findById(authorId);
        user.posts = user.posts.filter(id => id.toString() !== postId);
        await user.save();

        // delete associated comments
        await Comment.deleteMany({post:postId});

        return res.status(200).json({
            success:true,
            message:'Post deleted'
        })

    } catch (error) {
        console.log(error);
    }
}

export const bookmarkPost=async(req,res)=>{
    try{
        const postId=req.params.id
        const userId=req.id
        const post=await Post.findById(postId)
        if(!post){
            return res.status(404).json({
                success:false,
                message:"Post not found"
            })
        }

        const user=User.findById(userId)
        if(user.bookmarks.includes(post._id)){
            //already bookmarked
            //remove from the bookmarks
            await user.updateOne({$pull:{bookmarks:post._id}})
            await user.save()
            return res.status(200).json({
                success:true,
                type:'unsaved',
                message:"Post Unbookmarked Successfully",
                post
            })
        }
        else{
            //bookmark
            await user.updateOne({$addToSet:{bookmarks:post._id}})

            return res.status(200).json({
                success:true,
                type:'saved',
                message:"Post bookmarked Successfully",
                post
            })
        }
        
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Cannot bookmark/unbookmark post",
            err
        })
    }
}



