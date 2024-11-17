
import express from "express";
const router = express.Router();

import {Signup,Login,Logout,getMe,deleteAccount,verifyEmail} from '../controllers/auth.js'
import {protectRoute} from '../middleware/protectRoute.js'

router.get('/me',protectRoute,getMe)
router.post('/signup',Signup)
router.post('/login',Login)
router.post('/verify',verifyEmail)
router.post('/logout',Logout)
router.get('/check-auth',protectRoute)
router.delete('/deleteaccount',protectRoute,deleteAccount)

export default router