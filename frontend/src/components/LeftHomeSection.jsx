import React from "react";
import ProfileCard from "./ProfileCard";
import SuggestionToFollow from "./SuggestionToFollow";

const LeftHomeSection = () => {
  return (
    <div className="h-full overflow-y-auto no-scrollbar space-y-2">
      <ProfileCard />
    </div>
  );
};
export default LeftHomeSection;