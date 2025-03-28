import express from "express";
import {
  getSuggestedUsers,
  getUserProfile,
  loginUser,
  registerUser,
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

userRouter.patch('/skills',authMiddleware,updateSkills)

export default userRouter;
