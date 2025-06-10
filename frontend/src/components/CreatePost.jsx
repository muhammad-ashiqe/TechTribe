import React, { useContext, useEffect, useState } from "react";
import CreatePostModal from "./CreatePostModal";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { SocialContext } from "../context/context";
import { PhotoIcon, DocumentTextIcon, PlusCircleIcon, ArrowPathIcon } from "@heroicons/react/24/outline";

const CreatePost = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { baseUrl, token } = useContext(SocialContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        if (!token) {
          console.error("No token found. User must log in.");
          return;
        }

        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await axios.get(`${baseUrl}/user/profile`, config);
        setUser(data);
      } catch (error) {
        console.error("Error fetching user profile:", error.response?.data?.message || error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [token, baseUrl]);

  const handleOptionClick = () => setIsModalOpen(true);

  // Skeleton Loading State
  if (isLoading) {
    return (
      <div className="w-full p-6 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl border border-gray-700 animate-pulse">
        {/* Top Section Skeleton */}
        <div className="flex items-center gap-4">
          {/* Avatar Skeleton */}
          <div className="w-14 h-14 rounded-full bg-gray-700 border-2 border-gray-700" />
          
          {/* Input Field Skeleton */}
          <div className="flex-1">
            <div className="w-full p-4 bg-gray-800/70 rounded-xl border border-gray-700 h-[56px]" />
          </div>
          
          {/* Post Button Skeleton */}
          <div className="p-3 bg-gray-700 rounded-xl w-12 h-12" />
        </div>
        
        {/* Divider */}
        <div className="my-4 border-t border-gray-700"></div>
        
        {/* Bottom Options Skeleton */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto px-6 py-3 rounded-xl bg-gray-800/50">
            <div className="w-6 h-6 bg-gray-700 rounded" />
            <div className="h-4 bg-gray-700 rounded w-24" />
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto px-6 py-3 rounded-xl bg-gray-800/50">
            <div className="w-6 h-6 bg-gray-700 rounded" />
            <div className="h-4 bg-gray-700 rounded w-24" />
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (!user) {
    return (
      <div className="p-4 bg-gray-900/50 rounded-2xl text-center text-gray-400 flex items-center justify-center gap-2">
        <ArrowPathIcon className="w-5 h-5 animate-spin" />
        Loading...
      </div>
    );
  }

  return (
    <div className="w-full p-6 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl border border-gray-700 ">
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <img
          className="w-14 h-14 rounded-full object-cover border-2 border-gray-700 hover:border-blue-400 transition-all duration-300 cursor-pointer"
          src={user.profilePic}
          alt="Profile"
          onClick={() => navigate(`/profile/${user._id}`)}
        />

        {/* Input Field */}
        <div className="flex-1">
          <div
            onClick={handleOptionClick}
            className="w-full p-4 bg-gray-800/70 text-gray-400 rounded-xl cursor-pointer hover:bg-gray-700/30 transition-all duration-300 border border-gray-700 hover:border-blue-500"
          >
            What's on your mind?
          </div>
        </div>

        {/* Post Button */}
        <button
          onClick={handleOptionClick}
          className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl hover:from-blue-400 hover:to-purple-400 transition-all duration-300"
        >
          <PlusCircleIcon className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Options Divider */}
      <div className="my-4 border-t border-gray-700"></div>

      {/* Bottom Options */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          onClick={handleOptionClick}
          className="flex items-center gap-3 w-full sm:w-auto px-6 py-3 rounded-xl bg-gray-800/50 hover:bg-gray-700/30 transition-all duration-300 text-gray-400 hover:text-blue-400"
        >
          <PhotoIcon className="w-6 h-6" />
          <span className="text-sm">Photo/Video</span>
        </button>

        <button
          onClick={handleOptionClick}
          className="flex items-center gap-3 w-full sm:w-auto px-6 py-3 rounded-xl bg-gray-800/50 hover:bg-gray-700/30 transition-all duration-300 text-gray-400 hover:text-purple-400"
        >
          <DocumentTextIcon className="w-6 h-6" />
          <span className="text-sm">Create Thread</span>
        </button>
      </div>

      <CreatePostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default CreatePost;