import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";
import { createPost, getAllPost } from "../controllers/postController.js";
import upload from "../middleware/multer.js";

const postRouter = express.Router();

postRouter.post("/create", authMiddleware, upload.single("image"), createPost);

postRouter.get('/getAllPost',getAllPost)

export default postRouter;
