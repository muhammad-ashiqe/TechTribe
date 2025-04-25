import Post from "../model/postModel.js";
import User from "../model/userModel.js";

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
    const reportedItems = await Post.countDocuments({ "reports": { $gte: 1 } });
    
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
          title: "Reported Items",
          value: reportedItems,
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
    const reportsPerDay = await Post.aggregate([
      { $match: { "reports": { $gte: 1 } } },
      {
        $project: {
          date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }
        }
      },
      { $group: { _id: "$date", reports: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    // Format the response for the chart
    const formattedReportsData = reportsPerDay.map(item => ({
      date: item._id,
      reports: item.reports,
    }));

    res.json({
      chartData: formattedReportsData
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
        select: 'username email profilePicture'  // adjust fields as needed
      })
      // populate users who liked the post
      .populate({
        path: 'likes',
        select: 'username profilePicture'
      })
      // populate each comment's user
      .populate({
        path: 'comments.user',
        select: 'username profilePicture'
      })
      // populate users who shared the post
      .populate({
        path: 'shares',
        select: 'username profilePicture'
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
