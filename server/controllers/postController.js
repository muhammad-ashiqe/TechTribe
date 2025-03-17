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
      return res.status(400).json({ message: "Post must contain text or an image." });
    }

    const newPost = new Post({
      user: userId,
      description,
      image: imageUrl, // Store the Cloudinary image URL
    });

    await newPost.save();

    res.status(201).json({ message: "Post created successfully", post: newPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
