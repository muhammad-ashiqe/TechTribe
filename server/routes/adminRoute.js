import express from "express"
import { fetchAllPosts, fetchAllUsers, getPostReports, getUserReports, latestPost, latestSignup, postPerDay, reportPerDay, totalSummary, updateReportStatus, userGrowth } from "../controllers/adminController.js";

const adminRouter = express.Router();

//stats
adminRouter.get('/dashboard/status',totalSummary);

//graphs
adminRouter.get('/dashboard/user-growth',userGrowth);
adminRouter.get('/dashboard/post-per-day',postPerDay);
adminRouter.get('/dashboard/report-per-day',reportPerDay);

//card
adminRouter.get('/dashboard/latest-signup',latestSignup);
adminRouter.get('/dashboard/latest-post',latestPost);


//fetch allUsers
adminRouter.get('/fetch-all-users',fetchAllUsers)
adminRouter.get('/fetch-all-posts',fetchAllPosts)


adminRouter.get("/reports/posts", getPostReports);
adminRouter.get("/reports/users", getUserReports);
adminRouter.patch('/reports/:reportId/status',updateReportStatus)

export {adminRouter}