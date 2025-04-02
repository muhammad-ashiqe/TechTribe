import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { FiMessageSquare, FiUserPlus, FiUserCheck, FiChevronDown, FiChevronUp } from "react-icons/fi";
import Post from "../components/Post";

const UserProfile = () => {
  const [profileData, setProfileData] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [showSkills, setShowSkills] = useState(false);
  const { userId } = useParams();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        // Fetch current user info
        const currentUserResponse = await axios.get("/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCurrentUserId(currentUserResponse.data._id);

        // Fetch profile data (user info)
        const profileResponse = await axios.get(
          `http://localhost:7000/api/user/user-profile/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProfileData(profileResponse.data);
        setIsFollowing(
          profileResponse.data.followers?.includes(currentUserResponse.data._id)
        );

        // Fetch user posts separately
        const postsResponse = await axios.get(
          `http://localhost:7000/api/post/user/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log(postsResponse);
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
      const token = localStorage.getItem("token");
      if (!token) return;

      const url = isFollowing
        ? `/api/user/unfollow/${userId}`
        : `/api/user/follow/${userId}`;

      await axios.post(url, {}, { headers: { Authorization: `Bearer ${token}` } });
      setIsFollowing(!isFollowing);

      // Refresh profile data to update followers count
      const updatedProfile = await axios.get(`/api/user/user-profile/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfileData(updatedProfile.data);
    } catch (err) {
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
    return (
      <div className="text-center py-10 text-red-500">Error: {error}</div>
    );
  }

  if (!profileData) {
    return <div className="text-center py-10">User not found</div>;
  }

  console.log(userPosts)

  return (
    <div className="max-w-4xl mx-auto bg-gray-900 min-h-screen text-white">
      {/* Cover Photo with Profile Image Overlay */}
      <div className="relative h-48 sm:h-64 w-full bg-gray-800">
  {/* Cover Photo */}
  <img
    src={profileData.coverPhoto || "https://images.unsplash.com/photo-1579547945413-497e1b99dac0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"}
    alt="Cover"
    className="w-full h-full object-cover"
  />
  
  {/* Dark overlay gradient */}
  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent" />
  
  {/* Profile Picture */}
  <div className="absolute -bottom-16 left-6 sm:left-8 z-10">
    <div className="relative">
      <img
        src={profileData.profilePic || "https://www.gravatar.com/avatar/?d=mp"}
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
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
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
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  {profileData.website}
                </a>
              )}
            </div>

            {/* Stats */}
            <div className="flex gap-6 mt-6 py-3 border-t border-gray-800">
              <div className="text-center">
                <span className="font-bold block">{profileData.followers?.length || 0}</span>
                <span className="text-sm text-gray-400">Followers</span>
              </div>
              <div className="text-center">
                <span className="font-bold block">{profileData.following?.length || 0}</span>
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
                <div key={post.id} className="p-5 bg-gray-800 rounded-xl shadow">
                  <Post key={post.id} post={post}/>
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