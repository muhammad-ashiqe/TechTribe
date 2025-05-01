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
  ]),
  updateUserProfile
);

userRouter.patch("/skills", authMiddleware, updateSkills);

userRouter.get("/search", searchUser);

userRouter.get("/user-profile/:userId", getUserWithId);

userRouter.post("/experience", authMiddleware, addExperience);
userRouter.put("/experiences/:id", authMiddleware, updateExperience);
userRouter.delete("/experiences/:id", authMiddleware, deleteExperience);

userRouter.post("/follow/:userId", authMiddleware, followUser);
userRouter.post("/unfollow/:userId", authMiddleware, unfollowUser);

userRouter.post("/user/report",authMiddleware,reportUser)
export default userRouter;
