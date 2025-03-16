import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";
import { createPost } from "../controllers/postController.js";


const postRouter = express.Router();

postRouter.post("/create", authMiddleware, createPost); 

export default postRouter;
