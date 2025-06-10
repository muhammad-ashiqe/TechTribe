import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import CreatePost from "./CreatePost";
import Post from "./Post";
import { SocialContext } from "../context/context";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { baseUrl, token } = useContext(SocialContext);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${baseUrl}/post/getAllPost`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchPosts();
    }
  }, [token, baseUrl]);

  // Post Skeleton Component
  const PostSkeleton = () => (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl border border-gray-700 p-6 mb-4 animate-pulse">
      {/* Author Section */}
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-full bg-gray-700"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-700 rounded-full w-32 mb-2"></div>
          <div className="h-3 bg-gray-700 rounded-full w-24"></div>
        </div>
      </div>
      
      {/* Content Section */}
      <div className="space-y-3 mb-4">
        <div className="h-4 bg-gray-700 rounded-full"></div>
        <div className="h-4 bg-gray-700 rounded-full w-5/6"></div>
        <div className="h-4 bg-gray-700 rounded-full w-3/4"></div>
      </div>
      
      {/* Media Placeholder */}
      <div className="h-64 bg-gray-700 rounded-xl mb-4"></div>
      
      {/* Stats Section */}
      <div className="flex gap-4 mb-4">
        <div className="h-5 w-16 bg-gray-700 rounded-full"></div>
        <div className="h-5 w-16 bg-gray-700 rounded-full"></div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex gap-2">
        <div className="h-10 bg-gray-700 rounded-full flex-1"></div>
        <div className="h-10 bg-gray-700 rounded-full flex-1"></div>
        <div className="h-10 bg-gray-700 rounded-full flex-1"></div>
      </div>
    </div>
  );

  return (
    <>
      <CreatePost />
      
      <div className="feed w-full py-4 bg-black rounded-t-2xl min-h-[80vh]">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <PostSkeleton key={index} />
            ))}
          </div>
        ) : posts.length > 0 ? (
          posts.map((post) => <Post key={post.id} post={post} />)
        ) : (
          <p className="text-white text-center py-8">No posts available yet</p>
        )}
      </div>
    </>
  );
};

export default Feed;