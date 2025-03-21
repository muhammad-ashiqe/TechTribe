import mongoose from "mongoose";

const ExperienceSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  company: { type: String, required: true, trim: true },
  period: { type: String, required: true, trim: true },
  description: { type: String, default: "", trim: true },
});

const EducationSchema = new mongoose.Schema({
  institution: { type: String, required: true, trim: true },
  degree: { type: String, required: true, trim: true },
  period: { type: String, required: true, trim: true },
});

const RecommendationSchema = new mongoose.Schema({
  from: { type: String, required: true, trim: true },
  position: { type: String, default: "", trim: true },
  content: { type: String, required: true, trim: true },
});

const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
    },
    password: { type: String, required: true, minlength: 6 },
    profilePic: {
      type: String,
      default: "https://res.cloudinary.com/default-profile-pic.jpg",
      trim: true,
    },
    coverPhoto: {
      type: String,
      default: "https://i.pinimg.com/736x/a7/d2/45/a7d24524d2d02bc104ec0c0aff36dcf6.jpg",
      trim: true,
    },
    headline: { type: String, default: "", trim: true },
    location: { type: String, default: "", trim: true },
    phone: { type: String, default: "", trim: true },
    website: { type: String, default: "", trim: true },
    bio: { type: String, maxlength: 160, default: "", trim: true },
    experiences: [ExperienceSchema],
    education: [EducationSchema],
    skills: [{ type: String, trim: true }],
    recommendations: [RecommendationSchema],
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true, minimize: false }
);

const User = mongoose.model("User", UserSchema);
export default User;
