//for chatting
import {Conversation} from "../models/conversationModel.js"
import { Message } from "../models/messageModel.js"

export const sendMessage=async(req,res)=>{
    try{
        const senderId=req.id
        const receiverId=req.params.id
        const {message}=req.body

        let conversation=await Conversation.findOne({
            participants:{$all:[senderId,receiverId]}
        })

        //establish the conversation if not started yet
        if(!conversation){
            conversation=await Conversation.create({
                participants:[senderId,receiverId]
            })
        }

        const newMessage=await Message.create({
            senderId,
            receiverId,
            message
        })

        if(newMessage) conversation.messages.push(newMessage._id)
        await Promise.call(conversation.save(),newMessage.save())

        //implement socket io for real time data transfer

        return res.status(200).json({
            success:true,
            message:"Successfully Send Message",
            newMessage
        })
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Cannt send message"
        })
    }
}

export const getMessage=async(req,res)=>{
    try{
        const senderId=req.id
        const receiverId=req.params.id

        const conversation=Conversation.find({
            participants:{$all:[senderId,receiverId]}
        })

        if(!conversation){
            return res.status(200).json({
                success:true,
                message:[]
            })
        }

        return res.status(200).json({
            success:true,
            messages:conversation?.messages
        })
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Cannt get messages"
        })
    }
}