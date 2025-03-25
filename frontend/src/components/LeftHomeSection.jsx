import React from "react";
import ProfileCard from "./ProfileCard";
import SuggestionToFollow from "./SuggestionToFollow";


const LeftHomeSection = () => {
  return (
    <div className="w-[20%]  bg-black rounded-2xl   flex flex-col gap-1 ">
      {/* Profile Card */}
      <div className="">
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
