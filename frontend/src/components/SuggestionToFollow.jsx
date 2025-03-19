import React, { useEffect, useState } from "react";
import FollowProfileCard from "./FollowProfileCard";

const SuggestionToFollow = () => {
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await fetch("http://localhost:7000/api/user/suggestedUsers"); // API endpoint
        const data = await response.json();
        setProfiles(data.slice(0, 3)); // Show only 3 profiles
      } catch (error) {
        console.error("Error fetching profiles:", error);
      }
    };

    fetchProfiles();
  }, []);

  return (
    <div className="bg-gray-800 rounded-xl p-3 shadow-lg text-white">
      {/* Title */}
      <div className="mb-2">
        <p className="text-md font-bold">Suggestions to Follow</p>
      </div>

      {/* Profiles List */}
      <div className="space-y-1">
        {profiles.map((profile) => (
          <FollowProfileCard key={profile._id} profile={profile} />
        ))}
      </div>

      {/* See More */}
      <div className="p-2 border-t border-gray-700 text-center cursor-pointer hover:text-blue-700 transition duration-300 text-xs font-semibold">
        <p>See more</p>
      </div>
    </div>
  );
};

export default SuggestionToFollow;
