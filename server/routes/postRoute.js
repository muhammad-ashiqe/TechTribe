import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { 
  commentOnPost, 
  createPost, 
  deletePost, 
  fetchUserPost, 
  getAllPost, 
  getMyPosts, 
  getSinglePost, 
  likePost 
} from "../controllers/postController.js";
import upload from "../middleware/multer.js";

const postRouter = express.Router();

// Correct order - specific routes FIRST
postRouter.get('/getAllPost', getAllPost); // Feed posts route
postRouter.get('/my-posts', authMiddleware, getMyPosts); // User's personal posts
postRouter.get('/:postId', getSinglePost); // Generic ID route LAST

// Other routes...
postRouter.post("/create", authMiddleware, upload.single("image"), createPost);
postRouter.delete("/:id", authMiddleware, deletePost);
postRouter.put("/:id/like", authMiddleware, likePost);
postRouter.post("/:postId/comment", authMiddleware, commentOnPost);
postRouter.get("/user/:userId",fetchUserPost)

export default postRouter;