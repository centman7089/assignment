import express from "express"
import { getUsers, login, logout, signup } from "../controllers/authController.js"



const router = express.Router()




router.post("/signup", signup )
router.post("/login", login)
router.post("/logout",logout )
router.get("/get-user",getUsers )





export default router