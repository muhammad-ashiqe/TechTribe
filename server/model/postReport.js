import mongoose from "mongoose";

const PostReportSchema = new mongoose.Schema({
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  reportedPost: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true
  },
  reason: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ["pending", "reviewed", "resolved"],
    default: "pending"
  }
}, {
  timestamps: true 
});

const PostReport = mongoose.model("PostReport", PostReportSchema);
export default PostReport;