import React, { useContext, useEffect, useState } from "react";
import FollowProfileCard from "./FollowProfileCard";
import { useNavigate } from "react-router-dom";
import { FiRefreshCw } from "react-icons/fi";
import { SocialContext } from "../context/context";

const SuggestionToFollow = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const {baseUrl,token} = useContext(SocialContext)

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
    <div className="bg-gray-800 rounded-xl p-4 shadow-lg text-white w-full">
      {/* Header with refresh button */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-md font-bold">Who to follow</h3>
        <button 
          onClick={handleRefresh}
          className="text-gray-400 hover:text-blue-400 transition-colors"
          aria-label="Refresh suggestions"
        >
          <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="text-center py-4 text-red-400 text-sm">
          {error}
          <button 
            onClick={fetchProfiles}
            className="mt-2 text-blue-400 hover:underline block mx-auto"
          >
            Try again
          </button>
        </div>
      ) : profiles.length > 0 ? (
        <>
          <div className="space-y-3">
            {profiles.map((profile) => (
              <FollowProfileCard key={profile._id} profile={profile} />
            ))}
          </div>
          <button
            onClick={handleSeeMore}
            className="w-full mt-3 py-2 text-blue-400 hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors"
          >
            Show more
          </button>
        </>
      ) : (
        <div className="text-center py-4 text-gray-400 text-sm">
          No suggestions available
        </div>
      )}
    </div>
  );
};

export default SuggestionToFollow;