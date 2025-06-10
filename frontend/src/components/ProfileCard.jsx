import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SocialContext } from "../context/context";
import { UserCircleIcon, UsersIcon, BookmarkIcon, XMarkIcon } from "@heroicons/react/24/outline";

const ProfileCard = () => {
  const { user } = useContext(SocialContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading state for 1.5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  // Skeleton Loading State
  if (isLoading) {
    return (
      <div className="flex flex-col bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden w-full relative">
        {/* Cover Photo Skeleton */}
        <div className="relative h-32 bg-gray-800 animate-pulse" />
        
        {/* Profile Image Skeleton */}
        <div className="absolute bottom-76 left-1/2 transform -translate-x-1/2">
          <div className="h-24 w-24 rounded-full bg-gray-700 border-4 border-gray-900 animate-pulse" />
        </div>

        {/* Profile Content Skeleton */}
        <div className="pt-16 px-6 pb-6">
          {/* User Info Skeleton */}
          <div className="text-center space-y-3 mb-6">
            <div className="h-6 bg-gray-700 rounded-full max-w-[180px] mx-auto animate-pulse" />
            <div className="h-4 bg-gray-700 rounded-full max-w-[140px] mx-auto animate-pulse" />
          </div>
          
          {/* Bio Skeleton */}
          <div className="space-y-2 mb-6">
            <div className="h-3 bg-gray-700 rounded-full animate-pulse" />
            <div className="h-3 bg-gray-700 rounded-full animate-pulse" />
            <div className="h-3 bg-gray-700 rounded-full w-4/5 mx-auto animate-pulse" />
          </div>
          
          {/* Stats Skeleton */}
          <div className="flex justify-around bg-gray-900/50 rounded-xl p-4 mb-6">
            <div className="text-center">
              <div className="h-5 bg-gray-700 rounded-full w-8 mx-auto mb-2 animate-pulse" />
              <div className="h-3 bg-gray-700 rounded-full w-16 mx-auto animate-pulse" />
            </div>
            <div className="h-8 w-px bg-gray-700" />
            <div className="text-center">
              <div className="h-5 bg-gray-700 rounded-full w-8 mx-auto mb-2 animate-pulse" />
              <div className="h-3 bg-gray-700 rounded-full w-16 mx-auto animate-pulse" />
            </div>
          </div>
          
          {/* Button Skeleton */}
          <div className="w-full py-3 rounded-xl bg-gray-700 animate-pulse" />
        </div>
      </div>
    );
  }

  // Error State
  if (!user) {
    return (
      <div className="p-4 bg-red-900/50 rounded-xl text-center text-red-300 flex items-center gap-2 justify-center">
        <XMarkIcon className="w-5 h-5" />
        Failed to load profile
      </div>
    );
  }

  // Actual Profile Card
  return (
    <div className="flex flex-col bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden w-full relative group">
      {/* Cover Photo */}
      <div className="relative h-32 bg-gradient-to-r from-blue-500/30 to-purple-500/30">
        {user.coverPhoto ? (
          <img
            src={user.coverPhoto}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20" />
        )}
        
        {/* Profile Image */}
        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
          <div className="relative group">
            <img
              src={user.profilePic || "https://www.gravatar.com/avatar/?d=mp"}
              alt="Profile"
              className="h-24 w-24 object-cover rounded-full border-4 border-gray-900 hover:border-blue-400 transition-all duration-300 cursor-pointer shadow-xl"
              onClick={() => navigate("/myprofile")}
            />
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="pt-16 px-6 pb-6">
        {/* User Info */}
        <div className="text-center space-y-2 mb-6">
          <h3 
            onClick={() => navigate("/myprofile")}
            className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent hover:from-blue-300 hover:to-purple-300 transition-all duration-300 cursor-pointer"
          >
            {user.firstName} {user.lastName}
          </h3>
          <p className="text-gray-400 text-sm flex items-center justify-center gap-2">
            <BookmarkIcon className="w-4 h-4" />
            {user.headline || "Update your headline"}
          </p>
        </div>

        {/* Bio */}
        <p className="text-gray-300 text-sm text-center mb-6 line-clamp-3 hover:line-clamp-none transition-all duration-300 cursor-default">
          {user.bio || "Click below to complete your profile"}
        </p>

        {/* Stats */}
        <div className="flex justify-around bg-gray-900/50 rounded-xl p-4 mb-6">
          <div className="text-center cursor-pointer hover:text-blue-400 transition-all duration-300">
            <p className="font-bold text-lg text-white">{user.followersCount || 0}</p>
            <p className="text-gray-400 text-sm flex items-center gap-1">
              <UsersIcon className="w-4 h-4" />
              Followers
            </p>
          </div>
          <div className="h-8 w-px bg-gray-700"></div>
          <div className="text-center cursor-pointer hover:text-purple-400 transition-all duration-300">
            <p className="font-bold text-lg text-white">{user.followingCount || 0}</p>
            <p className="text-gray-400 text-sm flex items-center gap-1">
              <UserCircleIcon className="w-4 h-4" />
              Following
            </p>
          </div>
        </div>

        {/* Profile Button */}
        <button
          onClick={() => navigate("/myprofile")}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white font-medium transition-all duration-300 flex items-center justify-center gap-2"
        >
          View My Profile
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;