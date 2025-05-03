import mongoose from "mongoose";

const EducationSchema = new mongoose.Schema({
  institution: { type: String, required: true, trim: true },
  degree: { type: String, required: true, trim: true },
  period: { type: String, required: true, trim: true },
});

const ExperienceSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  company: { type: String, required: true, trim: true },
  period: { type: String, required: true, trim: true },
  description: { type: String, default: "", trim: true },
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
      default: "https://www.shutterstock.com/image-vector/avatar-gender-neutral-silhouette-vector-600nw-2470054311.jpg",
      trim: true,
    },
    coverPhoto: {
      type: String,
      default:
        "https://www.newforma.com/wp-content/themes/newforma/assets/images/lazyload-fallback.png",
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
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    isBanned: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, minimize: false }
);

const User = mongoose.model("User", UserSchema);
export default User;
