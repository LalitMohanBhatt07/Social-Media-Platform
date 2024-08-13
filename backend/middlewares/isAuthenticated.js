import jwt from "jsonwebtoken";
import dotenv from "dotenv"
dotenv.config()

const isAuthenticated=async(req,res,next)=>{
    try{
        const token=req.cookie.token
        if(!token){
            return res.status(401).json({
                message:"user not authenticated"
                ,success:false
            })
        }
        const decode=await jwt.verify(token,process.env.SECRET_KEY)

        if(!decode){
            return res.status(401).json({
                success:false,
                message:"Invalid token"
            })
        }
        req.id=decode.userId
        next()
    }
    catch(err){
        console.log(err)
        return res.status(500).json({
            success:false,
            message:"Cannot authticate user with the help of token"
        })
    }
}
export default isAuthenticated