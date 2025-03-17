import React from "react";
import FollowProfileCard from "./FollowProfileCard";

const SuggestionToFollow = () => {
  return (
    <div className="bg-gray-800 rounded-xl p-3 shadow-lg text-white ">
      {/* Title */}
      <div className="mb-2">
        <p className="text-md font-bold">Suggestions to Follow</p>
      </div>

      {/* Profiles */}
      <div className="space-y-1">
        <FollowProfileCard />
        <FollowProfileCard />
        <FollowProfileCard />
      </div>

      {/* See More */}
      <div className="p-2 border-t border-gray-700 text-center cursor-pointer hover:text-blue-700 transition duration-300 text-xs font-semibold">
       <p> See more</p>
      </div>
    </div>
  );
};

export default SuggestionToFollow;
