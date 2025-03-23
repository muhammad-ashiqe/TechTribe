import User from "../model/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cloudinary from "../config/cloudinary.js";

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

// Get user profile
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
    const { firstName, lastName, headline, location, phone, website, bio, profilePic, coverPhoto } = req.body;

    // Use the current image URLs as fallback values
    let profilePicUrl = profilePic || "";
    let coverPhotoUrl = coverPhoto || "";

    // Upload new profile picture if provided
    if (req.files && req.files.profilePicFile && req.files.profilePicFile.length > 0) {
      const avatarResult = await cloudinary.uploader.upload(
        req.files.profilePicFile[0].path,
        { folder: "users/profilePic" }
      );
      profilePicUrl = avatarResult.secure_url;
    }

    // Upload new cover photo if provided
    if (req.files && req.files.coverPhotoFile && req.files.coverPhotoFile.length > 0) {
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
    res.status(200).json({ message: "User updated successfully", user: updatedUser });
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
      return res.status(400).json({ message: "Skills must be an array of strings" });
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



export {
  registerUser,
  loginUser,
  getUserProfile,
  getSuggestedUsers,
  updateUserProfile,
  updateSkills
};
