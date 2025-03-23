import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";
import { createPost, deletePost, getAllPost, getMyPosts } from "../controllers/postController.js";
import upload from "../middleware/multer.js";

const postRouter = express.Router();

postRouter.post("/create", authMiddleware, upload.single("image"), createPost);

postRouter.get('/getAllPost',getAllPost)

postRouter.get("/my-posts", authMiddleware, getMyPosts);

postRouter.delete("/:id",authMiddleware,deletePost)

export default postRouter;
