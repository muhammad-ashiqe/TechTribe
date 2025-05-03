import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { SocialContext } from "../context/context";
import { 
  HeartIcon, 
  ChatBubbleOvalLeftIcon, 
  EllipsisHorizontalIcon, 
  BookmarkIcon, 
  FlagIcon, 
  ShareIcon 
} from "@heroicons/react/24/outline";
import { 
  HeartIcon as HeartSolidIcon, 
  BookmarkIcon as BookmarkSolidIcon 
} from "@heroicons/react/24/solid";
import { toast } from "react-toastify";

const Post = ({ post }) => {
  const [liked, setLiked] = useState(post.isLied || false);
  const [likeCount, setLikeCount] = useState(post.reactions || 0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [isReporting, setIsReporting] = useState(false);
  
  const { baseUrl, token } = useContext(SocialContext);
  const navigate = useNavigate();

  const reportReasons = [
    "Spam",
    "Inappropriate content",
    "Harassment or bullying",
    "False information",
    "Violence",
    "Other"
  ];

  const handleCommentClick = () => navigate(`/post/${post.id}`);

  const handleLike = async () => {
    try {
      const response = await axios.put(
        `${baseUrl}/post/${post.id}/like`,
        null,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLiked(response.data.isLied);
      setLikeCount(response.data.likes.length);
    } catch (error) {
      console.error("Error updating like:", error);
    }
  };

  const handleReportSubmit = async () => {
    if (!reportReason || (reportReason === "Other" && !customReason)) return;
    
    try {
      setIsReporting(true);
      const finalReason = reportReason === "Other" ? customReason : reportReason;
      
      await axios.post(
        `${baseUrl}/post/post/report`,
        {
          postId: post.id,
          reason: finalReason
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setShowReportModal(false);
      setReportReason("");
      setCustomReason("");
      toast.success("Thank you for your report. We'll review it shortly.");
    } catch (error) {
      console.error("Error submitting report:", error);
      toast.error("Failed to submit report. Please try again later.");
    } finally {
      setIsReporting(false);
    }
  };

console.log(post)

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 mb-4 shadow-2xl border border-gray-700 relative">
      {/* Top Section */}
      <div className="flex items-start gap-4 mb-6">
        <img
          className="w-14 h-14 rounded-full object-cover border-2 border-gray-700 cursor-pointer hover:border-blue-400 transition-all duration-300"
          src={post.profilePic}
          alt={post.username}
          onClick={() => navigate(`/profile/${post.userId}`)}
        />
        <div className="flex-1">
          <h3 
            className="text-white font-bold hover:text-blue-400 transition-colors cursor-pointer"
            onClick={() => navigate(`/profile/${post.userId}`)}
          >
            {post.username}
          </h3>
          <p className="text-sm text-gray-400">{post.headline}</p>
          <p className="text-xs text-gray-500 mt-1">
            {new Date(post.timeAgo).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
        <div className="relative">
          <EllipsisHorizontalIcon
            className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          />
          {isMenuOpen && (
            <div className="absolute right-0 top-8 bg-gray-800 rounded-xl shadow-2xl border border-gray-700 w-48 z-10">
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  setShowReportModal(true);
                }}
                className="w-full px-4 py-3 text-gray-300 hover:bg-gray-700/50 flex items-center gap-2 rounded-t-xl transition-all duration-200"
              >
                <FlagIcon className="w-5 h-5 text-red-400" />
                Report Post
              </button>
              <button
                onClick={() => setIsSaved(!isSaved)}
                className="w-full px-4 py-3 text-gray-300 hover:bg-gray-700/50 flex items-center gap-2 rounded-b-xl transition-all duration-200"
              >
                {isSaved ? (
                  <BookmarkSolidIcon className="w-5 h-5 text-blue-400" />
                ) : (
                  <BookmarkIcon className="w-5 h-5 text-blue-400" />
                )}
                {isSaved ? 'Unsave' : 'Save Post'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content Section */}
      {post.image && (
        <div className="my-6 rounded-xl overflow-hidden border border-gray-700">
          <img
            className="w-full max-h-[500px] object-contain"
            src={post.image}
            alt="Post content"
          />
        </div>
      )}
      <p className="text-gray-100 mb-6 whitespace-pre-line">{post.description}</p>

      {/* Analytics */}
      <div className="flex justify-between text-gray-400 text-sm mb-6">
        <div className="flex items-center gap-2">
          <HeartSolidIcon className="w-4 h-4 text-red-500" />
          {likeCount} reactions
        </div>
        <div>{post.comments} comments</div>
        <div>{post.shares?.length || 0} shares</div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-around border-t border-gray-700 pt-4">
        <button
          onClick={handleLike}
          className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors px-4 py-2 rounded-xl hover:bg-gray-700/30"
        >
          {liked ? (
            <HeartSolidIcon className="w-6 h-6 text-red-500" />
          ) : (
            <HeartIcon className="w-6 h-6" />
          )}
          Like
        </button>

        <button
          onClick={handleCommentClick}
          className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors px-4 py-2 rounded-xl hover:bg-gray-700/30"
        >
          <ChatBubbleOvalLeftIcon className="w-6 h-6" />
          Comment
        </button>

        <button className="flex items-center gap-2 text-gray-400 hover:text-green-400 transition-colors px-4 py-2 rounded-xl hover:bg-gray-700/30">
          <ShareIcon className="w-6 h-6" />
          Share
        </button>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4">Report Post</h3>
            
            <div className="space-y-3 mb-6">
              {reportReasons.map((reason) => (
                <button
                  key={reason}
                  onClick={() => setReportReason(reason)}
                  className={`w-full p-3 text-left rounded-lg transition-colors ${
                    reportReason === reason 
                      ? "bg-blue-500/20 border border-blue-500"
                      : "bg-gray-700/50 hover:bg-gray-700"
                  }`}
                >
                  <span className="text-gray-100">{reason}</span>
                </button>
              ))}
            </div>

            {reportReason === "Other" && (
              <textarea
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Please specify the reason..."
                className="w-full p-3 bg-gray-700/50 rounded-lg text-gray-100 placeholder-gray-400 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
              />
            )}

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowReportModal(false);
                  setReportReason("");
                  setCustomReason("");
                }}
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                disabled={isReporting}
              >
                Cancel
              </button>
              <button
                onClick={handleReportSubmit}
                disabled={!reportReason || (reportReason === "Other" && !customReason) || isReporting}
                className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isReporting ? "Submitting..." : "Submit Report"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Post;