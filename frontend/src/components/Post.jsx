import React from "react";

const Post = ({ post }) => {
  return (
    <div className="post-container bg-gray-800 rounded-lg p-4 mb-4 shadow-lg">
      {/* Post Top Section */}
      <div className="post-top-div flex items-start gap-3">
        {/* Profile Image */}
        <div className="profile">
          <img
            className="w-12 h-12 rounded-full object-cover"
            src={post.profilePic}
            alt={post.username}
          />
        </div>

        {/* Profile Description */}
        <div className="profile-description flex-1">
          <h3 className="text-white font-bold">{post.username}</h3>
          <p className="text-sm text-gray-400">{post.jobTitle}</p>
          <p className="text-xs text-gray-500">
            Posted {new Date(post.timeAgo).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Post Middle Section */}
      <div className="post-middle-div mt-4">
        {/* Image Container (Only if image exists) */}
        {post.image && (
          <div className="img-container w-full max-h-[500px] overflow-hidden rounded-lg flex justify-center">
            <img
              className="w-auto max-w-full h-auto max-h-[500px] object-contain"
              src={post.image}
              alt="Post Image"
            />
          </div>
        )}

        {/* Post Description */}
        <div className="post-description mt-3">
          <p className="text-white">{post.description}</p>
        </div>
      </div>

      {/* Analytics Section */}
      <div className="analytics flex justify-between mt-4 text-gray-400">
        <div className="reactions">
          <p>{post.reactions} reactions</p>
        </div>
        <div className="comments">
          <p>{post.comments} comments</p>
        </div>
        <div className="shares">
          <p>{post.shares} shares</p>
        </div>
      </div>

      {/* Post Bottom Section */}
      <div className="post-bottom-div flex justify-around mt-4 border-t border-gray-700 pt-3">
        <div className="like flex items-center gap-2 cursor-pointer hover:text-red-500 transition-colors">
          <i className="fa-regular fa-heart text-lg"></i>
          <p>Like</p>
        </div>
        <div className="comment flex items-center gap-2 cursor-pointer hover:text-blue-500 transition-colors">
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
