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
  likePost, 
  reportPost
} from "../controllers/postController.js";
import upload from "../middleware/multer.js";
import { checkBannedStatus } from "../middleware/banMiddleware.js";

const postRouter = express.Router();

// Correct order - specific routes FIRST
postRouter.get('/getAllPost', getAllPost); // Feed posts route
postRouter.get('/my-posts', authMiddleware,checkBannedStatus, getMyPosts); 
postRouter.get('/:postId', getSinglePost); 

// Other routes...
postRouter.post("/create", authMiddleware,checkBannedStatus, upload.single("image"), createPost);
postRouter.delete("/:id", authMiddleware,checkBannedStatus, deletePost);
postRouter.put("/:id/like", authMiddleware,checkBannedStatus, likePost);
postRouter.post("/:postId/comment", authMiddleware,checkBannedStatus, commentOnPost);
postRouter.get("/user/:userId",fetchUserPost)
postRouter.post('/post/report',authMiddleware,checkBannedStatus,reportPost);

export default postRouter;