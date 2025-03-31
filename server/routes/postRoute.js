import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";
import { commentOnPost, createPost, deletePost, getAllPost, getMyPosts, getSinglePost, likePost } from "../controllers/postController.js";
import upload from "../middleware/multer.js";

const postRouter = express.Router();

postRouter.post("/create", authMiddleware, upload.single("image"), createPost);

postRouter.get('/getAllPost',getAllPost)

postRouter.get('/:postId',getSinglePost)

postRouter.get("/my-posts", authMiddleware, getMyPosts);

postRouter.delete("/:id",authMiddleware,deletePost)

postRouter.put("/:id/like", authMiddleware,likePost);

postRouter.post("/:postId/comment", authMiddleware,commentOnPost);


export default postRouter;
