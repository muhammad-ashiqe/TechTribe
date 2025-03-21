import express from "express";
import {
  getSuggestedUsers,
  getUserProfile,
  loginUser,
  registerUser,
  updateUserProfile,
} from "../controllers/userController.js";
import upload from "../middleware/multer.js";

//creting a user router
const userRouter = express.Router();

userRouter.post("/register", registerUser);

userRouter.post("/login", loginUser);

userRouter.get("/profile", getUserProfile);

userRouter.get("/suggestedUsers", getSuggestedUsers);

userRouter.put("/update",upload.fields([
  { name: "profilePic", maxCount: 1 },
  { name: "coverPhoto", maxCount: 1 },
]), updateUserProfile);

export default userRouter;
