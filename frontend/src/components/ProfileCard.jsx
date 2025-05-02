import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { SocialContext } from "../context/context";
import { UserCircleIcon, PencilIcon, UsersIcon, BookmarkIcon,XMarkIcon } from "@heroicons/react/24/outline";

const ProfileCard = () => {
  const { user } = useContext(SocialContext);
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="p-4 bg-red-900/50 rounded-xl text-center text-red-300 flex items-center gap-2 justify-center">
        <XMarkIcon className="w-5 h-5" />
        Failed to load profile
      </div>
    );
  }

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
            <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
              <PencilIcon className="w-6 h-6 text-white" />
            </div>
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
          <PencilIcon className="w-5 h-5" />
          View My Profile
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;