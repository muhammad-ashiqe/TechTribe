import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Post author
    description: { type: String, required: true }, // Required post content
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Users who liked the post
    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        text: String,
        createdAt: { type: Date, default: Date.now },
      },
    ], // Comments array
    shares: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Users who shared the post
  },
  { timestamps: true } // CreatedAt & UpdatedAt fields
);

const Post = mongoose.model("Post", PostSchema);
export default Post;
