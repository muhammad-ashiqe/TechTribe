import Post from "../model/postModel.js";
import { PostReport } from "../model/postReport.js";
import User from "../model/userModel.js";
import { UserReport } from "../model/userReport.js";
import cloudinary from "../config/cloudinary.js";
import jwt from "jsonwebtoken"

//admin login 
export const loginAdmin = async(req,res)=>{
  const {email,password} = req.body;

  if (!email || !password) {
    return res.status(401).json({message:"provide full details"});
  }

  if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASS) {
    return res.status(401).json({message:"invalid credentials"});
  }

  const token = jwt.sign({email:email},process.env.JWT_SECRET);

  res.status(200).json({message:"login success",token:token})
}

//status section 
export const totalSummary = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsersToday = await User.countDocuments({
      "lastLogin": { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
    });
    const totalPosts = await Post.countDocuments();
    const totalComments = await Post.aggregate([
      { $unwind: "$comments" },
      { $count: "totalComments" }
    ]);
     // Get total reported posts and users
     const reportedPosts = await PostReport.countDocuments();
     const reportedUsers = await UserReport.countDocuments();
     const totalReports = reportedPosts + reportedUsers;
 
    // Get the latest 5 signups (by createdAt in descending order)
    const latestSignups = await User.find().sort({ createdAt: -1 }).limit(5);
    const newSignupsToday = latestSignups.length;  // Just the count of the latest 5 users

    // Structure the data for ShadCN UI components
    res.json({
      stats: [
        {
          title: "Total Users",
          value: totalUsers,
          icon: "users",
          color: "primary",
        },
        {
          title: "Active Users Today",
          value: activeUsersToday,
          icon: "activity",
          color: "secondary",
        },
        {
          title: "Total Posts",
          value: totalPosts,
          icon: "post",
          color: "info",
        },
        {
          title: "Total Comments",
          value: totalComments[0]?.totalComments || 0,
          icon: "comment",
          color: "warning",
        },
        {
          title: "Reported Content",
          value: totalReports,
          icon: "alert-circle",
          color: "danger",
        },
        {
          title: "New Signups (Latest 5 Users)",
          value: newSignupsToday,
          icon: "user-plus",
          color: "success",
        }
      ]
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//graphs for dashboard
export const userGrowth = async(req,res)=>{
  try {
    const userGrowth = await User.aggregate([
      {
        $project: {
          date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          user: "$_id"
        }
      },
      { $group: { _id: "$date", count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    // Format the response to match chart data needs
    const formattedGrowth = userGrowth.map(item => ({
      date: item._id,
      count: item.count,
    }));

    res.json({
      chartData: formattedGrowth
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const postPerDay = async(req,res)=>{
  try {
    const postsPerDay = await Post.aggregate([
      {
        $project: {
          date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }
        }
      },
      { $group: { _id: "$date", posts: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    // Format the response for chart data
    const formattedPostsData = postsPerDay.map(item => ({
      date: item._id,
      posts: item.posts,
    }));

    res.json({
      chartData: formattedPostsData
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const reportPerDay = async (req,res)=>{
  try {
    // Get post reports per day
    const postReports = await PostReport.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          postReports: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Get user reports per day
    const userReports = await UserReport.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          userReports: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Combine data into single timeline
    const reportMap = new Map();

    // Process post reports
    postReports.forEach(({ _id, postReports }) => {
      reportMap.set(_id, {
        date: _id,
        postReports,
        userReports: 0
      });
    });

    // Process user reports
    userReports.forEach(({ _id, userReports }) => {
      if (reportMap.has(_id)) {
        reportMap.get(_id).userReports = userReports;
      } else {
        reportMap.set(_id, {
          date: _id,
          postReports: 0,
          userReports
        });
      }
    });

    // Convert to sorted array
    const combinedData = Array.from(reportMap.values()).sort((a, b) => 
      new Date(a.date) - new Date(b.date)
    );

    res.status(200).json({
      success: true,
      data: combinedData
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch report analytics",
      error: error.message
    });
  }
}

//cards for dashboard
export const latestSignup =async(req,res)=>{
  try {
    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5);
    res.json({
      recentUsers: recentUsers.map(user => ({
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        profilePic: user.profilePic,
        signupDate: user.createdAt,
      }))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const latestPost = async(req,res)=>{
  try {
    const recentPosts = await Post.find().sort({ createdAt: -1 }).limit(5).populate("user");
    res.json({
      recentPosts: recentPosts.map(post => ({
        postId: post._id,
        description: post.description,
        user: `${post.user.firstName} ${post.user.lastName}`,
        createdAt: post.createdAt,
        commentsCount: post.comments.length,
        likesCount: post.likes.length,
      }))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}



//show users
export const fetchAllUsers =async(req,res)=>{
  try {
    const users = await User.find({})
      .select('-password') // Don't send password hash
      .populate('followers', 'firstName lastName profilePic')
      .populate('following', 'firstName lastName profilePic');
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users', error: err.message });
  }
}

//show users
export const fetchAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      // populate the author of the post
      .populate({
        path: 'user',
        select: 'firstName lastName email profilePic'  // adjust fields as needed
      })
      // populate users who liked the post
      .populate({
        path: 'likes',
        select: 'firstName lastName profilePic'
      })
      // populate each comment's user
      .populate({
        path: 'comments.user',
        select: 'firstName lastName profilePic'
      })
      // populate users who shared the post
      .populate({
        path: 'shares',
        select: 'firstName lastName profilePic'
      })
      // most recent posts first
      .sort({ createdAt: -1 });

    // return the full array of posts
    return res.status(200).json(posts);
  } catch (err) {
    console.error('Error fetching posts:', err);
    return res.status(500).json({ message: 'Server Error', error: err.message });
  }
};



// Get all post reports with populated data
export const getPostReports = async (req, res) => {
  try {
    const postReports = await PostReport.find()
      .populate({
        path: 'reportedBy',
        select: 'firstName lastName email profilePic'
      })
      .populate({
        path: 'reportedPost',
        select: 'description image createdAt',
        populate: {
          path: 'user',
          select: 'firstName lastName profilePic'
        }
      })
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      data: postReports.map(report => ({
        ...report,
        type: 'post'
      }))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch post reports",
      error: error.message
    });
  }
};

// Get all user reports with populated data
export const getUserReports = async (req, res) => {
  try {
    const userReports = await UserReport.find()
      .populate({
        path: 'reportedBy',
        select: 'firstName lastName email profilePic'
      })
      .populate({
        path: 'reportedUser',
        select: 'firstName lastName email profilePic headline location'
      })
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      data: userReports.map(report => ({
        ...report,
        type: 'user'
      }))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch user reports",
      error: error.message
    });
  }
};


// Update report status
export const updateReportStatus =  async (req, res) => {
  try {
    const { reportId } = req.params
    const { newStatus, reportType } = req.body

    const validStatuses = ['pending', 'reviewed', 'resolved']
    if (!validStatuses.includes(newStatus)) {
      return res.status(400).json({ message: 'Invalid status' })
    }

    const Model = reportType === 'post' ? PostReport : UserReport
    const updatedReport = await Model.findByIdAndUpdate(
      reportId,
      { status: newStatus },
      { new: true }
    )

    if (!updatedReport) {
      return res.status(404).json({ message: 'Report not found' })
    }

    res.json({
      success: true,
      data: updatedReport
    })
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating report status',
      error: error.message
    })
  }
}

//delete post 
export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params

    // Find post with validation
    const post = await Post.findById(postId)
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      })
    }

    // Delete associated image from Cloudinary if exists
    if (post.image) {
      const publicId = post.image.split('/').pop().split('.')[0]
      await cloudinary.uploader.destroy(`posts/${publicId}`)
    }

    // Delete post and associated data in transaction
    await Promise.all([
      Post.findByIdAndDelete(postId),
      PostReport.deleteMany({ reportedPost: postId }),
      // Remove post from users' likedPosts arrays
      User.updateMany(
        { _id: { $in: post.likes } },
        { $pull: { likedPosts: postId } }
      ),
      // Remove post from users' sharedPosts arrays
      User.updateMany(
        { _id: { $in: post.shares } },
        { $pull: { sharedPosts: postId } }
      )
    ])

    res.status(200).json({
      success: true,
      message: 'Post and all associated data deleted successfully'
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete post',
      error: error.message
    })
  }
}

// ban user
export const banUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isBanned = !user.isBanned;
    await user.save();

    res.status(200).json({
      message: `User ${user.isBanned ? 'banned' : 'unbanned'} successfully`,
      user: {
        _id: user._id,
        isBanned: user.isBanned,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error updating user ban status',
      error: error.message
    });
  }
};