import express from "express"
import isAuthenticated from "../middlewares/isAuthenticated.js"
import upload from "../middlewares/multer.js"
import {getMessage, sendMessage} from "../controllers/Message.js"

const router=express.Router()

router.post('/send/:id',isAuthenticated,sendMessage)
router.post("/all/:id",isAuthenticated,getMessage)

export default router
