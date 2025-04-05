import User from "../model/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cloudinary from "../config/cloudinary.js";
import mongoose from "mongoose";
import Post from "../model/postModel.js";

// User registration
const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "3d" }
    );

    // Omit sensitive data from the response
    const userResponse = {
      _id: newUser._id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      profilePic: newUser.profilePic,
    };

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error("Error in registerUser:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// Login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "3d" }
    );

    // Omit sensitive data from the response
    const userResponse = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      profilePic: user.profilePic,
    };

    res
      .status(200)
      .json({ message: "Login successful", token, user: userResponse });
  } catch (error) {
    console.error("Error in loginUser:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// Get loggined user profile
const getUserProfile = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const user = await User.findById(userId)
      .select("-password") // Exclude the password field
      .populate("followers", "firstName lastName profilePic")
      .populate("following", "firstName lastName profilePic");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      profilePic: user.profilePic,
      coverPhoto: user.coverPhoto,
      headline: user.headline,
      location: user.location,
      phone: user.phone,
      website: user.website,
      bio: user.bio,
      jobTitle: user.jobTitle,
      company: user.company,
      experiences: user.experiences,
      education: user.education,
      skills: user.skills,
      recommendations: user.recommendations,
      postsCount: user.posts.length,
      followersCount: user.followers.length,
      followingCount: user.following.length,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error.message);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

//get suggession users
const getSuggestedUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("firstName lastName profilePic jobTitle") // Fetch only needed fields
      .limit(10); // Limit the number of users (optional)

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// updated profile
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user._id; // Extracted from auth middleware
    const {
      firstName,
      lastName,
      headline,
      location,
      phone,
      website,
      bio,
      profilePic,
      coverPhoto,
    } = req.body;

    // Use the current image URLs as fallback values
    let profilePicUrl = profilePic || "";
    let coverPhotoUrl = coverPhoto || "";

    // Upload new profile picture if provided
    if (
      req.files &&
      req.files.profilePicFile &&
      req.files.profilePicFile.length > 0
    ) {
      const avatarResult = await cloudinary.uploader.upload(
        req.files.profilePicFile[0].path,
        { folder: "users/profilePic" }
      );
      profilePicUrl = avatarResult.secure_url;
    }

    // Upload new cover photo if provided
    if (
      req.files &&
      req.files.coverPhotoFile &&
      req.files.coverPhotoFile.length > 0
    ) {
      const coverResult = await cloudinary.uploader.upload(
        req.files.coverPhotoFile[0].path,
        { folder: "users/coverPhoto" }
      );
      coverPhotoUrl = coverResult.secure_url;
    }

    // Update the user document with the new values
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        firstName,
        lastName,
        headline,
        location,
        phone,
        website,
        bio,
        profilePic: profilePicUrl,
        coverPhoto: coverPhotoUrl,
      },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

//update skills
const updateSkills = async (req, res) => {
  try {
    const { skills } = req.body;
    // Ensure skills is an array
    if (!Array.isArray(skills)) {
      return res
        .status(400)
        .json({ message: "Skills must be an array of strings" });
    }

    // Update the user's skills; req.user.id should be set by your auth middleware
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { skills },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ skills: updatedUser.skills });
  } catch (error) {
    console.error("Error updating skills:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// Add new experience
const addExperience = async (req, res) => {
  try {
    const { title, company, period, description } = req.body;
    
    if (!title || !company || !period) {
      return res.status(400).json({ message: "Title, company and period are required" });
    }

    const newExperience = {
      title,
      company,
      period,
      description: description || ""
    };

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $push: { experiences: newExperience } },
      { new: true }
    );

    res.status(201).json({ experiences: user.experiences });
  } catch (error) {
    console.error("Error adding experience:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// Update experience
const updateExperience = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, company, period, description } = req.body;

    if (!title || !company || !period) {
      return res.status(400).json({ message: "Title, company and period are required" });
    }

    const user = await User.findOneAndUpdate(
      { _id: req.user._id, "experiences._id": id },
      {
        $set: {
          "experiences.$.title": title,
          "experiences.$.company": company,
          "experiences.$.period": period,
          "experiences.$.description": description || ""
        }
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "Experience not found" });
    }

    res.json({ experiences: user.experiences });
  } catch (error) {
    console.error("Error updating experience:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete experience
const deleteExperience = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { experiences: { _id: id } } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ experiences: user.experiences });
  } catch (error) {
    console.error("Error deleting experience:", error);
    res.status(500).json({ message: "Server error" });
  }
};


//searchUser
const searchUser = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.trim() === "") {
      return res.json([]);
    }

    const users = await User.find({
      $or: [
        { firstName: { $regex: query, $options: "i" } },
        { lastName: { $regex: query, $options: "i" } },
        { headline: { $regex: query, $options: "i" } },
      ],
    })
      .select("firstName lastName profilePic headline")
      .limit(10);

    res.json(users || []);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json([]);
  }
};

//get user with id 
const getUserWithId =  async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate userId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    // Fetch user data
    const user = await User.findById(userId)
      .select('-password') // Exclude sensitive fields
      .lean(); // Convert to plain JavaScript object

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Fetch user's posts
    const posts = await Post.find({ author: userId })
      .sort({ createdAt: -1 }) // Newest first
      .populate('author', 'firstName lastName profilePic') // Include author details
      .lean();

    // Combine user data with posts
    const response = {
      ...user,
      posts
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

const followUser = async (req, res) => {
  try {
    // Check if user is trying to follow themselves
    if (req.user._id.toString() === req.params.userId) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    // Find the current user and the user to follow
    const currentUser = await User.findById(req.user._id);
    const userToFollow = await User.findById(req.params.userId);

    if (!userToFollow) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if already following
    if (currentUser.following.includes(req.params.userId)) {
      return res.status(400).json({ message: "Already following this user" });
    }

    // Update both users
    currentUser.following.push(req.params.userId);
    userToFollow.followers.push(req.user._id);

    await currentUser.save();
    await userToFollow.save();

    res.status(200).json({ message: "Successfully followed user" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const unfollowUser = async (req, res) => {
  try {
    // Check if user is trying to unfollow themselves
    if (req.user._id.toString() === req.params.userId) {
      return res.status(400).json({ message: "You cannot unfollow yourself" });
    }

    // Find the current user and the user to unfollow
    const currentUser = await User.findById(req.user._id);
    const userToUnfollow = await User.findById(req.params.userId);

    if (!userToUnfollow) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if not following
    if (!currentUser.following.includes(req.params.userId)) {
      return res.status(400).json({ message: "Not following this user" });
    }

    // Update both users
    currentUser.following = currentUser.following.filter(
      id => id.toString() !== req.params.userId
    );
    userToUnfollow.followers = userToUnfollow.followers.filter(
      id => id.toString() !== req.user._id.toString()
    );

    await currentUser.save();
    await userToUnfollow.save();

    res.status(200).json({ message: "Successfully unfollowed user" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export {
  registerUser,
  loginUser,
  getUserProfile,
  getSuggestedUsers,
  updateUserProfile,
  updateSkills,
  searchUser,
  getUserWithId,
  addExperience,
  updateExperience,
  deleteExperience,
  followUser,
  unfollowUser
};
