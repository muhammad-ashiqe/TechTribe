import React from "react";
import { TrashIcon } from "@heroicons/react/24/outline";

const Post = ({ post, handleDeletePost }) => {
  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-gray-700 shadow-xl mb-6 relative">
      {/* Delete Button */}
      <button 
        onClick={() => handleDeletePost(post._id)}
        className="absolute top-4 right-4 p-1.5 hover:bg-gray-700/30 rounded-full transition-all duration-300"
      >
        <TrashIcon className="w-5 h-5 text-red-400 hover:text-red-300" />
      </button>

      {/* Post Timestamp */}
      <p className="text-xs text-gray-400 mb-4">
        Posted {new Date(post.createdAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}
      </p>

      {/* Post Content */}
      {post.image && (
        <div className="my-4 rounded-xl overflow-hidden border border-gray-700">
          <img
            src={post.image}
            alt="Post content"
            className="w-full max-h-[500px] object-contain"
            onError={(e) => e.target.style.display = 'none'}
          />
        </div>
      )}
      
      {/* Post Description */}
      <p className="text-gray-100 whitespace-pre-line">{post.description}</p>

      {/* Status Indicator */}
      <div className="mt-4 pt-3 border-t border-gray-700">
        <span className="text-sm text-blue-400">
          {post.status || "Published"}
        </span>
      </div>
    </div>
  );
};

export default Post;