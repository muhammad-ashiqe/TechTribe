import React, { useState } from "react";
import { FiUserPlus, FiUserCheck } from "react-icons/fi";

const FollowProfileCard = ({ profile }) => {
  const [isFollowing, setIsFollowing] = useState(false);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    // Here you would typically make an API call to follow/unfollow the user
  };

  return (
    <div className="flex items-center justify-between p-3 hover:bg-gray-700 rounded-lg transition-colors duration-200">
      {/* Profile Info */}
      <div 
        className="flex items-center space-x-3 flex-1 min-w-0 cursor-pointer"
        onClick={() => console.log("Navigate to profile")} // Replace with your navigation logic
      >
        <div className="flex-shrink-0">
          <img
            src={profile.profilePic || "https://www.gravatar.com/avatar/?d=mp"}
            alt={`${profile.firstName}'s profile`}
            className="h-10 w-10 sm:h-12 sm:w-12 object-cover rounded-full border-2 border-gray-600 hover:border-blue-500 transition-colors"
          />
        </div>
        <div className="min-w-0">
          <h3 className="text-sm sm:text-base font-semibold truncate">
            {profile.firstName} {profile.lastName}
          </h3>
          <p className="text-xs sm:text-sm text-gray-400 truncate">
            {profile.jobTitle || "No job title"}
          </p>
        </div>
      </div>

      {/* Follow Button */}
      <button
        onClick={handleFollow}
        className={`flex items-center justify-center px-3 py-1 rounded-full text-xs sm:text-sm font-medium transition-colors ${
          isFollowing
            ? "bg-transparent border border-gray-600 text-gray-300 hover:border-red-400 hover:text-red-400"
            : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
      >
        {isFollowing ? (
          <>
            <FiUserCheck className="mr-1" />
            Following
          </>
        ) : (
          <>
            <FiUserPlus className="mr-1" />
            Follow
          </>
        )}
      </button>
    </div>
  );
};

export default FollowProfileCard;