import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { SocialContext } from "../context/context";

const Post = ({ post }) => {
  // Initialize state from post.isLied (provided by backend)
  const [liked, setLiked] = useState(post.isLied || false);
  const [likeCount, setLikeCount] = useState(post.reactions || 0);
  const {baseUrl,token} = useContext(SocialContext)

  const navigate = useNavigate();

  const handleCommentClick = () => {
    navigate(`/post/${post.id}`);
  };

  const handleLike = async () => {
    try {
      const response = await axios.put(
        `${baseUrl}/post/${post.id}/like`,
        null,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update state from the backend response
      setLiked(response.data.isLied);
      setLikeCount(response.data.likes.length);
    } catch (error) {
      console.error("Error updating like:", error);
    }
  };

  return (
    <div className="post-container bg-gray-800 rounded-lg p-4 mb-4 shadow-lg">
      <div className="post-top-div flex items-start gap-3">
        <div className="profile">
          <img
            className="w-12 h-12 rounded-full object-cover"
            src={post.profilePic}
            alt={post.username}
          />
        </div>
        <div className="profile-description flex-1">
          <h3 className="text-white font-bold">{post.username}</h3>
          <p className="text-sm text-gray-400">{post.jobTitle}</p>
          <p className="text-xs text-gray-500">
            Posted {new Date(post.timeAgo).toLocaleString()}
          </p>
        </div>
      </div>
      <div className="post-middle-div mt-4">
        {post.image && (
          <div className="img-container w-full max-h-[500px] overflow-hidden rounded-lg flex justify-center">
            <img
              className="w-auto max-w-full h-auto max-h-[500px] object-contain"
              src={post.image}
              alt="Post Image"
            />
          </div>
        )}
        <div className="post-description mt-3">
          <p className="text-white">{post.description}</p>
        </div>
      </div>
      <div className="analytics flex justify-between mt-4 text-gray-400">
        <div className="reactions">
          <p>{likeCount} reactions</p>
        </div>
        <div className="comments">
          <p>{post.comments} comments</p>
        </div>
        <div className="shares">
          <p>{post.shares ? post.shares.length : 0} shares</p>
        </div>
      </div>
      <div className="post-bottom-div flex justify-around mt-4 border-t border-gray-700 pt-3">
        <div onClick={handleLike} className="like flex items-center gap-2 cursor-pointer text-red-700 hover:text-red-500 transition-colors">
          <i className={`fa-heart text-lg ${liked ? "fas" : "far"}`}></i>
          {/* <p>{liked ? "" : "Like"}</p> */}
        </div>
        <div onClick={()=>handleCommentClick()}  className="comment flex items-center gap-2 cursor-pointer hover:text-blue-500 transition-colors">
          <i className="fa-regular fa-comment text-lg"></i>
          <p>Comment</p>
        </div>
        <div className="share flex items-center gap-2 cursor-pointer hover:text-green-500 transition-colors">
          <i className="fa-solid fa-share-nodes text-lg"></i>
          <p>Share</p>
        </div>
      </div>
    </div>
  );
};

export default Post;
