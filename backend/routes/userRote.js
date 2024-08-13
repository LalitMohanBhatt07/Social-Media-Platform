import express from "express"
import { editProfile, followUnfollow, getProfile, getSuggestedUser, login, logout, register } from "../controllers/User.js"
import isAuthenticated from "../middlewares/isAuthenticated.js"
import upload from "../middlewares/multer.js"
import e from "express"
const router=express.Router()

router.post('/register',register)
router.post('/login',login)
router.get('/logout',logout)
router.get("/id:profile",isAuthenticated,getProfile)
router.post("/profile/edit",isAuthenticated,upload,single('profilePicture'),editProfile)
router.get('suggested',isAuthenticated,getSuggestedUser)
router.post('/followunfloow/:id',isAuthenticated,followUnfollow)

export default router