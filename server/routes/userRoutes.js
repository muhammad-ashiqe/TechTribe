import express from "express";
import {
  addExperience,
  deleteExperience,
  followUser,
  getSuggestedUsers,
  getUserProfile,
  getUserWithId,
  loginUser,
  registerUser,
  reportUser,
  searchUser,
  unfollowUser,
  updateExperience,
  updateSkills,
  updateUserProfile,
} from "../controllers/userController.js";
import upload from "../middleware/multer.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { checkBannedStatus } from "../middleware/banMiddleware.js";


//creting a user router
const userRouter = express.Router();

userRouter.post("/register", registerUser);

userRouter.post("/login", loginUser);

userRouter.get("/profile", getUserProfile);

userRouter.get("/suggestedUsers", getSuggestedUsers);

userRouter.put(
  "/update",
  authMiddleware,
  upload.fields([
    { name: "profilePicFile", maxCount: 1 },
    { name: "coverPhotoFile", maxCount: 1 },
  ]),checkBannedStatus,
  updateUserProfile
);

userRouter.patch("/skills", authMiddleware,checkBannedStatus, updateSkills);

userRouter.get("/search", searchUser);

userRouter.get("/user-profile/:userId", getUserWithId);

userRouter.post("/experience", authMiddleware,checkBannedStatus, addExperience);
userRouter.put("/experiences/:id", authMiddleware,checkBannedStatus, updateExperience);
userRouter.delete("/experiences/:id", authMiddleware,checkBannedStatus, deleteExperience);

userRouter.post("/follow/:userId", authMiddleware,checkBannedStatus, followUser);
userRouter.post("/unfollow/:userId", authMiddleware,checkBannedStatus, unfollowUser);

userRouter.post("/user/report",authMiddleware,checkBannedStatus,reportUser)
export default userRouter;
