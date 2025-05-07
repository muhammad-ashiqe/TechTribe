import React, { useState } from "react";
import { FiUserPlus, FiUserCheck } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const FollowProfileCard = ({ profile }) => {
  
  const navigate = useNavigate()


// console.log(profile)
  return (
    <div className="flex items-center justify-between p-3 hover:bg-gray-700 rounded-lg transition-colors duration-200">
      {/* Profile Info */}
      <div 
        className="flex items-center space-x-3 flex-1 min-w-0 cursor-pointer"
        onClick={()=>navigate(`/profile/${profile._id}`)}
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
            {profile.headline || "No job title"}
          </p>
        </div>
      </div>

    </div>
  );
};

export default FollowProfileCard;