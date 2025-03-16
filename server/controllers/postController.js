import Post from "../model/postModel.js";


// Create a post (Text Only)
export const createPost = async (req, res) => {
  try {
    const { description } = req.body;
    const userId = req.user._id; // Extracted from auth middleware

    if (!description) {
      return res.status(400).json({ message: "Description is required" });
    }

    const newPost = new Post({
      user: userId,
      description,
    });

    await newPost.save();

    res.status(201).json({ message: "Post created successfully", post: newPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
