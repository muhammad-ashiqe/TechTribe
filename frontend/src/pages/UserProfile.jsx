import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Post from "../components/Post";
import { SocialContext } from "../context/context";
import { UserPlusIcon, UserMinusIcon, ChatBubbleOvalLeftIcon, ChevronUpIcon, ChevronDownIcon, BriefcaseIcon, AcademicCapIcon, MapPinIcon, LinkIcon } from "@heroicons/react/24/outline";
import { ArrowPathIcon } from "@heroicons/react/24/solid";

const UserProfile = () => {
  const [profileData, setProfileData] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [showSkills, setShowSkills] = useState(false);
  const [showExperience, setShowExperience] = useState(false);
  const { userId } = useParams();
  const {baseUrl,token} = useContext(SocialContext)

  useEffect(() => {
    const fetchProfileData = async () => {
      
      try {

        if (!token) return;

        // Fetch current user info and profile data in parallel for better performance
        const [currentUserResponse, profileResponse] = await Promise.all([
          axios.get(`${baseUrl}/user/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${baseUrl}/user/user-profile/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setCurrentUserId(currentUserResponse.data._id);
        setProfileData(profileResponse.data);

        // Properly check if current user is in the followers array
        // Convert both IDs to strings for reliable comparison
        const isUserFollowing = profileResponse.data.followers?.some(
          (followerId) =>
            followerId.toString() === currentUserResponse.data._id.toString()
        );
        setIsFollowing(isUserFollowing);

        // Fetch user posts separately
        const postsResponse = await axios.get(
          `${baseUrl}/post/user/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUserPosts(postsResponse.data);
      } catch (err) {
        setError(err.response?.data?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [userId]);

  const handleFollow = async () => {
    try {
      if (!token) {
        // Handle case where user is not logged in
        return;
      }

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      // Determine which endpoint to call based on current follow status
      const endpoint = isFollowing
        ? `${baseUrl}/user/unfollow/${userId}`
        : `${baseUrl}/user/follow/${userId}`;

      // Make the API call
      await axios.post(endpoint, {}, config);

      // Update local state immediately for better UX
      setIsFollowing(!isFollowing);

      // Update the followers count in the profile data
      setProfileData((prev) => ({
        ...prev,
        followers: isFollowing
          ? prev.followers.filter((id) => id !== currentUserId)
          : [...prev.followers, currentUserId],
      }));
    } catch (err) {
      console.error("Follow error:", err);
      setError(err.response?.data?.message || "Failed to update follow status");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">Error: {error}</div>;
  }

  if (!profileData) {
    return <div className="text-center py-10">User not found</div>;
  }


  return (
    <div className="max-w-4xl mx-auto bg-gradient-to-b from-gray-900 to-gray-800 min-h-screen text-white">
      {/* Cover Photo Section */}
      <div className="relative h-48 sm:h-64 group">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20" />
        <img
          src={profileData.coverPhoto}
          alt="Cover"
          className="w-full h-full object-cover"
          onError={(e) => e.target.style.display = 'none'}
        />
        <div className="absolute -bottom-16 left-6 sm:left-8 z-10">
          <img
            src={profileData.profilePic}
            alt="Profile"
            className="w-32 h-32 sm:w-36 sm:h-36 rounded-full border-2 border-gray-700 object-cover shadow-xl hover:border-blue-400 transition-all duration-300"
          />
        </div>
      </div>

      {/* Profile Content */}
      <div className="px-6 sm:px-8 pt-20 pb-8 space-y-8">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {profileData.firstName} {profileData.lastName}
            </h1>
            <p className="text-lg text-gray-300">{profileData.headline}</p>
            
            {/* Location & Website */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-400">
              {profileData.location && (
                <div className="flex items-center gap-2">
                  <MapPinIcon className="w-5 h-5 text-blue-400" />
                  {profileData.location}
                </div>
              )}
              {profileData.website && (
                <a
                  href={profileData.website}
                  className="flex items-center gap-2 text-blue-400 hover:text-purple-400 transition-colors"
                >
                  <LinkIcon className="w-5 h-5" />
                  Portfolio
                </a>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 py-4 border-y border-gray-700">
              <div className="text-left">
                <p className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {profileData.followers?.length || 0}
                </p>
                <p className="text-xs text-gray-400 uppercase tracking-wider">Followers</p>
              </div>
              <div className="text-left">
                <p className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {profileData.following?.length || 0}
                </p>
                <p className="text-xs text-gray-400 uppercase tracking-wider">Following</p>
              </div>
              <div className="text-left">
                <p className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {userPosts.length || 0}
                </p>
                <p className="text-xs text-gray-400 uppercase tracking-wider">Posts</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {currentUserId !== userId && (
            <div className="flex flex-col gap-3 w-full sm:w-auto">
              <button
                onClick={handleFollow}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  isFollowing
                    ? 'bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500'
                    : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400'
                }`}
              >
                <div className="flex items-center gap-2">
                  {isFollowing ? (
                    <>
                      <UserMinusIcon className="w-5 h-5" />
                      Unfollow
                    </>
                  ) : (
                    <>
                      <UserPlusIcon className="w-5 h-5" />
                      Follow
                    </>
                  )}
                </div>
              </button>
              <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 transition-all duration-300">
                <div className="flex items-center gap-2">
                  <ChatBubbleOvalLeftIcon className="w-5 h-5" />
                  Message
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Bio Section */}
        {profileData.bio && (
          <div className="p-4 bg-gray-800/50 rounded-2xl border border-gray-700">
            <p className="text-gray-300 whitespace-pre-line">{profileData.bio}</p>
          </div>
        )}

        {/* Experience Section */}
        {profileData.experiences?.length > 0 && (
          <div className="bg-gray-800/50 rounded-2xl border border-gray-700">
            <button
              onClick={() => setShowExperience(!showExperience)}
              className="flex items-center justify-between w-full px-6 py-4 hover:bg-gray-700/30 transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                <BriefcaseIcon className="w-6 h-6 text-blue-400" />
                <span className="text-lg font-semibold">Experience</span>
              </div>
              {showExperience ? (
                <ChevronUpIcon className="w-5 h-5" />
              ) : (
                <ChevronDownIcon className="w-5 h-5" />
              )}
            </button>
            {showExperience && (
              <div className="p-6 pt-0 space-y-4">
                {profileData.experiences.map((exp) => (
                  <div key={exp._id} className="p-4 bg-gray-900/30 rounded-xl border border-gray-700">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <h3 className="font-semibold text-lg">{exp.title}</h3>
                        <p className="text-blue-400">{exp.company}</p>
                        <p className="text-sm text-gray-400">{exp.period}</p>
                      </div>
                    </div>
                    {exp.description && (
                      <p className="mt-3 text-gray-300 text-sm">{exp.description}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Skills Section */}
        {profileData.skills?.length > 0 && (
          <div className="bg-gray-800/50 rounded-2xl border border-gray-700">
            <button
              onClick={() => setShowSkills(!showSkills)}
              className="flex items-center justify-between w-full px-6 py-4 hover:bg-gray-700/30 transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                <AcademicCapIcon className="w-6 h-6 text-purple-400" />
                <span className="text-lg font-semibold">Skills</span>
              </div>
              {showSkills ? (
                <ChevronUpIcon className="w-5 h-5" />
              ) : (
                <ChevronDownIcon className="w-5 h-5" />
              )}
            </button>
            {showSkills && (
              <div className="p-6 pt-0 flex flex-wrap gap-2">
                {profileData.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400 rounded-full text-sm border border-blue-400/30"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Posts Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Posts
          </h2>
          {userPosts.length > 0 ? (
            <div className="space-y-4">
              {userPosts.map((post) => (
                <Post key={post._id} post={post} />
              ))}
            </div>
          ) : (
            <div className="p-6 text-center rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700">
              <p className="text-gray-400">
                {currentUserId === userId
                  ? "You haven't shared anything yet"
                  : `${profileData.firstName} hasn't shared anything yet`}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
