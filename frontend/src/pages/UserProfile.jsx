import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  FiMessageSquare,
  FiUserPlus,
  FiUserCheck,
  FiChevronDown,
  FiChevronUp,
  FiChevronsUp,
  FiChevronsDown,
} from "react-icons/fi";
import Post from "../components/Post";
import { SocialContext } from "../context/context";

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

  console.log(userPosts);

  return (
    <div className="max-w-4xl mx-auto bg-gray-900 min-h-screen text-white">
      {/* Cover Photo with Profile Image Overlay */}
      <div className="relative h-48 sm:h-64 w-full bg-gray-800">
        {/* Cover Photo */}
        <img
          src={
            profileData.coverPhoto ||
            "https://images.unsplash.com/photo-1579547945413-497e1b99dac0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
          }
          alt="Cover"
          className="w-full h-full object-cover"
        />

        {/* Dark overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent" />

        {/* Profile Picture */}
        <div className="absolute -bottom-16 left-6 sm:left-8 z-10">
          <div className="relative">
            <img
              src={
                profileData.profilePic ||
                "https://www.gravatar.com/avatar/?d=mp"
              }
              alt="Profile"
              className="w-32 h-32 sm:w-36 sm:h-36 rounded-full border-4 border-gray-900 object-cover shadow-xl"
            />
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="px-6 sm:px-8 pt-20 pb-8">
        <div className="flex flex-col sm:flex-row">
          {/* Main Profile Info */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold">
              {profileData.firstName} {profileData.lastName}
            </h1>
            <p className="text-gray-300 mt-1">{profileData.headline}</p>

            {/* Bio */}
            {profileData.bio && (
              <p className="mt-4 text-gray-300">{profileData.bio}</p>
            )}

            {/* Location and Website */}
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-400">
              {profileData.location && (
                <span className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {profileData.location}
                </span>
              )}
              {profileData.website && (
                <a
                  href={`https://${profileData.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-400 hover:underline"
                >
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                    />
                  </svg>
                  {profileData.website}
                </a>
              )}
            </div>

            {/* Stats */}
            <div className="flex gap-6 mt-6 py-3 border-t border-gray-800">
              <div className="text-center">
                <span className="font-bold block">
                  {profileData.followers?.length || 0}
                </span>
                <span className="text-sm text-gray-400">Followers</span>
              </div>
              <div className="text-center">
                <span className="font-bold block">
                  {profileData.following?.length || 0}
                </span>
                <span className="text-sm text-gray-400">Following</span>
              </div>
              <div className="text-center">
                <span className="font-bold block">{userPosts.length || 0}</span>
                <span className="text-sm text-gray-400">Posts</span>
              </div>
            </div>
          </div>

          {/* Action Buttons (right side) */}
          {currentUserId !== userId && (
            <div className="mt-4 sm:mt-0 flex sm:flex-col gap-2">
              <button
                onClick={handleFollow}
                className={`flex items-center justify-center px-5 py-2.5 text-sm font-medium rounded-md ${
                  isFollowing
                    ? "bg-gray-800 hover:bg-gray-700"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isFollowing ? (
                  <>
                    <FiUserCheck className="mr-2" />
                    Following
                  </>
                ) : (
                  <>
                    <FiUserPlus className="mr-2" />
                    Follow
                  </>
                )}
              </button>
              <button className="flex items-center justify-center px-5 py-2.5 text-sm font-medium rounded-md bg-gray-800 hover:bg-gray-700">
                <FiMessageSquare className="mr-2" />
                Message
              </button>
            </div>
          )}
        </div>

        {/* experience section */}
        {profileData.experiences?.length > 0 && (
          <div className="mt-6">
            <button
              onClick={() => setShowExperience(!showExperience)}
              className="flex items-center justify-between w-full px-4 py-3 bg-gray-800 hover:bg-gray-700 transition-colors rounded-lg"
            >
              <span className="font-semibold">Experience</span>
              {showExperience ? <FiChevronsUp /> : <FiChevronsDown />}
            </button>
            {showExperience && (
              <div className="mt-3 space-y-4">
                {profileData.experiences.map((exp) => (
                  <div key={exp._id} className="p-4 bg-gray-800 rounded-lg">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{exp.title}</h3>
                        <p className="text-blue-400">{exp.company}</p>
                      </div>
                      <div className="text-right text-sm text-gray-400">
                        <p>
                          {exp.period}
                        </p>
                      </div>
                    </div>
                    {exp.description && (
                      <p className="mt-2 text-gray-300">{exp.description}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Skills Section */}
        {profileData.skills?.length > 0 && (
          <div className="mt-6">
            <button
              onClick={() => setShowSkills(!showSkills)}
              className="flex items-center justify-between w-full px-4 py-3 bg-gray-800 hover:bg-gray-700 transition-colors rounded-lg"
            >
              <span className="font-semibold">Skills</span>
              {showSkills ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            {showSkills && (
              <div className="mt-3 flex flex-wrap gap-2">
                {profileData.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-gray-800 text-blue-400 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Posts Section */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Posts</h2>
          {userPosts.length > 0 ? (
            <div className="space-y-4">
              {userPosts.map((post) => (
                <div
                  key={post.id}
                  className=""
                >
                  <Post key={post.id} post={post} />
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-gray-800 rounded-xl">
              <p className="text-gray-400">
                {currentUserId === userId
                  ? "You haven't posted anything yet."
                  : `${profileData.firstName} hasn't posted anything yet.`}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
