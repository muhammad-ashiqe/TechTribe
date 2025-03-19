import express from 'express'
import { getSuggestedUsers, getUserProfile, loginUser, registerUser } from '../controllers/userController.js';

//creting a user router
const userRouter = express.Router();

userRouter.post('/register',registerUser);

userRouter.post('/login',loginUser);

userRouter.get('/profile',getUserProfile)

userRouter.get('/suggestedUsers',getSuggestedUsers)


export default userRouter;