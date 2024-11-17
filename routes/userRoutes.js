import express from "express";
import {
  getUserProfile,
  FollowAndunFollowUser,
  getSuggestedUser,
  updateProfile,
} from "../controllers/userController.js";
import { protectRoute } from "../middleware/protectRoute.js";

const userRouter = express.Router();

userRouter.get("/profile/:username", protectRoute, getUserProfile);
userRouter.post("/suggested", protectRoute, getSuggestedUser);
userRouter.post("/follow/:id", protectRoute, FollowAndunFollowUser);
userRouter.post("/updateprofile", protectRoute, updateProfile);

export default userRouter;
