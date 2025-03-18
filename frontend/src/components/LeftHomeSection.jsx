import React from "react";
import ProfileCard from "./ProfileCard";
import SuggestionToFollow from "./SuggestionToFollow";


const LeftHomeSection = () => {
  return (
    <div className="w-[20%] h-screen overflow-y-auto">
      {/* Profile Card */}
      <div className="mb-3">
        <ProfileCard />
      </div>

      {/* Suggestions to Follow */}
      <div>
        <SuggestionToFollow />
      </div>
    </div>
  );
};

export default LeftHomeSection;
