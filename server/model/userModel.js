import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true }, // Added firstName
    lastName: { type: String, required: true, trim: true }, // Added lastName
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true, // Ensure emails are stored in lowercase
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please provide a valid email address"], // Email validation
    },
    password: { type: String, required: true, minlength: 6 }, // Added minimum password length
    profilePic: {
      type: String,
      default: "https://res.cloudinary.com/default-profile-pic.jpg",
      trim: true,
    },
    jobTitle: { type: String, default: "", trim: true },
    company: { type: String, default: "", trim: true },
    bio: { type: String, maxlength: 160, default: "", trim: true },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  
  },
  { timestamps: true, minimize: false }
);

const User = mongoose.model("User", UserSchema);
export default User;