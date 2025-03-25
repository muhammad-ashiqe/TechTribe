import Post from "../model/postModel.js";
import cloudinary from "../config/cloudinary.js";
import jwt from "jsonwebtoken"

// Create a post (Text + Optional Image)
export const createPost = async (req, res) => {
  try {
    const { description } = req.body;
    const userId = req.user._id; // Extracted from auth middleware
    let imageUrl = null;

    // If an image is uploaded, store it in Cloudinary
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "posts",
      });
      imageUrl = result.secure_url; // Get the Cloudinary URL
    }

    if (!description && !imageUrl) {
      return res
        .status(400)
        .json({ message: "Post must contain text or an image." });
    }

    const newPost = new Post({
      user: userId,
      description,
      image: imageUrl, // Store the Cloudinary image URL
    });

    await newPost.save();

    res
      .status(201)
      .json({ message: "Post created successfully", post: newPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

//get all the post
export const getAllPost = async (req, res) => {
  try {
    // Get current user ID from JWT token
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const currentUserId = decoded._id || decoded.id;

    // Fetch posts with user details
    const posts = await Post.find()
      .populate("user", "firstName lastName jobTitle profilePic")
      .sort({ createdAt: -1 })
      .lean(); // Convert to plain JS objects

    // Add isLied to each post
    const formattedPosts = posts.map((post) => ({
      id: post._id,
      username: `${post.user?.firstName || "Unknown"} ${post.user?.lastName || ""}`.trim(),
      jobTitle: post.user?.jobTitle || "No Job Title",
      profilePic: post.user?.profilePic || "https://res.cloudinary.com/default-profile-pic.jpg",
      timeAgo: post.createdAt,
      description: post.description,
      image: post.image || "",
      reactions: post.likes.length,
      comments: post.comments.length,
      shares: post.shares.length,
      isLied: post.likes.some(id => id.toString() === currentUserId.toString()), // Critical fix
    }));

    res.status(200).json(formattedPosts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Failed to retrieve posts" });
  }
};



// Fetch posts created by the authenticated user
export const getMyPosts = async (req, res) => {
  try {
    const userId = req.user._id; // Get user ID from authenticated request

    const posts = await Post.find({ user: userId })
      .sort({ createdAt: -1 }) // Most recent posts first
      .populate("user", "name profilePicture") // Populate user details
      .populate("likes", "name") // Populate likes
      .populate("comments.user", "name profilePicture"); // Populate comments

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching your posts", error });
  }
};

//delete post

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Optional: Check if the current user is authorized to delete the post
    if (post.user.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this post" });
    }

    // If the post contains an image, remove it from Cloudinary
    if (post.image && post.image.public_id) {
      await cloudinary.uploader.destroy(post.image.public_id);
    }

    // Delete the post from the database using deleteOne()
    await post.deleteOne();

    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// like post
export const likePost = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).json({ message: "No token provided" });

    const token = authHeader.split(" ")[1];
    if (!token)
      return res.status(401).json({ message: "Invalid token format" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const currentUserId = decoded._id || decoded.id;
    if (!currentUserId)
      return res.status(401).json({ message: "User not authorized" });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Check if already liked
    const isLiked = post.likes.some(id => id.toString() === currentUserId.toString());

    // Toggle like
    if (isLiked) {
      post.likes.pull(currentUserId);
    } else {
      post.likes.push(currentUserId);
    }

    await post.save();

    // Return updated like status and count
    res.status(200).json({
      _id: post._id,
      likes: post.likes,
      isLied: !isLiked, // Reflect the new state
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
