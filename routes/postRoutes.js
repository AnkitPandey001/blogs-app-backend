
import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {createPost,LikeUnlike,commentRoutes,deletePost,getAllpost,getFollowingPost,deleteComment} from '../controllers/postControllers.js'

const Postroutes = express.Router();

Postroutes.post("/create",protectRoute,createPost);
Postroutes.post("/like/:id",protectRoute,LikeUnlike);
Postroutes.post("/comment/:id",protectRoute,commentRoutes);
Postroutes.delete("/:id",protectRoute,deletePost)
Postroutes.get('/getallpost',getAllpost)
Postroutes.post('/following',protectRoute,getFollowingPost)
Postroutes.delete('/comment/:postId/:commentId', protectRoute, deleteComment);


export default Postroutes;
