import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePic: {
      type: String,
      default: "https://res.cloudinary.com/default-profile-pic.jpg",
    },
    jobTitle: { type: String, default: "" },
    company: { type: String, default: "" }, 
    bio: { type: String, maxlength: 160, default: "" }, 
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true, minimize: false }
);

const User = mongoose.model("User", UserSchema);
export default User;
