import React, { useContext, useEffect, useState } from "react";
import FollowProfileCard from "./FollowProfileCard";
import { useNavigate } from "react-router-dom";
import { SocialContext } from "../context/context";
import { ArrowPathIcon, UserGroupIcon } from "@heroicons/react/24/outline";

const SuggestionToFollow = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { baseUrl, token } = useContext(SocialContext);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      setError(null);      
      const response = await fetch(`${baseUrl}/user/suggestedUsers`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch suggestions');
      }
      
      const data = await response.json();
      setProfiles(data.slice(0, 3)); // Show only 3 profiles
    } catch (error) {
      console.error("Error fetching profiles:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const handleRefresh = () => {
    fetchProfiles();
  };

  const handleSeeMore = () => {
    navigate("/suggestions"); // Assuming you have a suggestions page
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 shadow-2xl border border-gray-700 w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <UserGroupIcon className="w-6 h-6 text-purple-400" />
          <h3 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Who to follow
          </h3>
        </div>
        <button 
          onClick={handleRefresh}
          className="p-1.5 hover:bg-gray-700/30 rounded-full transition-all duration-300"
          aria-label="Refresh suggestions"
        >
          <ArrowPathIcon className={`w-5 h-5 text-gray-400 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-4">
          <ArrowPathIcon className="w-6 h-6 animate-spin text-blue-400" />
        </div>
      ) : error ? (
        <div className="p-4 bg-red-900/50 rounded-xl flex flex-col items-center gap-3 text-red-300">
          <span>{error}</span>
          <button 
            onClick={fetchProfiles}
            className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700/50 transition-all duration-300 text-sm"
          >
            Try Again
          </button>
        </div>
      ) : profiles.length > 0 ? (
        <>
          <div className="space-y-4">
            {profiles.map((profile) => (
              <FollowProfileCard key={profile._id} profile={profile} />
            ))}
          </div>
          <button
            onClick={handleSeeMore}
            className="w-full mt-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white font-medium transition-all duration-300"
          >
            Show More
          </button>
        </>
      ) : (
        <div className="p-4 text-center text-gray-400 text-sm">
          No suggestions available
        </div>
      )}
    </div>
  );
};

export default SuggestionToFollow;