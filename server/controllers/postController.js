import Post from "../model/postModel.js";
import cloudinary from "../config/cloudinary.js";

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
    const posts = await Post.find()
      .populate("user", "firstName lastName jobTitle profilePic") // Fetch user details
      .sort({ createdAt: -1 });

    const formattedPosts = posts.map((post) => ({
      id: post._id,
      username: `${post.user?.firstName || "Unknown"} ${
        post.user?.lastName || ""
      }`.trim(),
      jobTitle: post.user?.jobTitle || "No Job Title",
      profilePic:
        post.user?.profilePic ||
        "https://res.cloudinary.com/default-profile-pic.jpg",
      timeAgo: post.createdAt,
      description: post.description,
      image: post.image || "", // Optional image
      reactions: post.likes.length,
      comments: post.comments.length,
      shares: post.shares.length,
    }));

    res.status(200).json(formattedPosts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Failed to retrieve posts" });
  }
};
