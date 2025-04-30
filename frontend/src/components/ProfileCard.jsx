import React, { useContext} from "react";
import { useNavigate } from "react-router-dom";
import { SocialContext } from "../context/context";

const ProfileCard = () => {

  const {user} = useContext(SocialContext)
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="p-4 bg-gray-800 rounded-xl text-center text-white">
        Failed to load profile. Please try again.
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-gray-800 rounded-xl overflow-hidden shadow-lg text-white w-full">
      {/* Banner */}
      <div className="relative h-24 bg-gradient-to-r from-blue-500 to-purple-600">
        {user.coverPhoto && (
          <img
            src={user.coverPhoto}
            alt="Banner"
            className="w-full h-full object-cover"
          />
        )}
        {/* Profile Image */}
        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
          <img
            src={user.profilePic || "https://www.gravatar.com/avatar/?d=mp"}
            alt="Profile"
            className="h-24 w-24 object-cover rounded-full border-4 border-gray-800 hover:border-blue-500 transition duration-300 cursor-pointer"
            onClick={() => navigate("/myprofile")}
          />
        </div>
      </div>

      {/* User Info */}
      <div className="pt-14 px-4 pb-4 text-center">
        <h3 className="text-lg font-bold hover:text-blue-400 transition duration-300 cursor-pointer" onClick={() => navigate("/myprofile")}>
          {user.firstName} {user.lastName}
        </h3>
        <p className="text-gray-400 text-sm mt-1">{user.headline || "Add your headline"}</p>
        <p className="text-gray-400 text-xs mt-2 line-clamp-2">
          {user.bio || "Click 'My Profile' to add a bio"}
        </p>
      </div>

      {/* Stats */}
      <div className="flex justify-around py-3 border-t border-gray-700 text-sm">
        <div className="text-center cursor-pointer hover:text-blue-400 transition duration-300">
          <p className="font-bold">{user.followersCount || 0}</p>
          <p className="text-gray-400">Followers</p>
        </div>
        <div className="h-8 w-px bg-gray-700"></div>
        <div className="text-center cursor-pointer hover:text-blue-400 transition duration-300">
          <p className="font-bold">{user.followingCount || 0}</p>
          <p className="text-gray-400">Following</p>
        </div>
      </div>

      {/* Profile Button */}
      <button 
        onClick={() => navigate("/myprofile")}
        className="py-3 border-t border-gray-700 text-center w-full hover:bg-gray-700 transition duration-300 text-sm font-semibold text-blue-400"
      >
        View My Profile
      </button>
    </div>
  );
};

export default ProfileCard;