// MyProfile.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import EditProfileModal from "../components/EditProfileModal";


const MyProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  // Fetch user profile on mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await axios.get("http://localhost:7000/api/user/profile", config);
        setUser(data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  if (loading) return <div>Loading profile...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="max-w-4xl mx-auto bg-gray-900 min-h-screen text-white overflow-hidden mt-10 rounded-t-2xl">
      {/* Cover Photo */}
      <div className="relative h-48 sm:h-64 group">
        <img
          src={user.coverPhoto}
          alt="Cover"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
        <div className="absolute -bottom-8 left-4 sm:left-8">
          <div className="relative group">
            <img
              src={user.profilePic}
              alt="Profile"
              className="w-20 h-20 sm:w-32 sm:h-32 rounded-full border-4 border-gray-900 object-cover shadow-xl transition-transform duration-300 hover:scale-105"
            />
            <div className="absolute inset-0 rounded-full border-2 border-white opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-8 pt-16 sm:pt-24 pb-8">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start mb-6">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {user.firstName} {user.lastName}
              <span className="ml-2 text-blue-400 text-xl">• 1st</span>
            </h1>
            <p className="text-gray-300 mt-1">{user.headline}</p>
            <div className="mt-2 text-sm text-gray-400">
              <span>{user.location}</span>
              <span className="mx-2">•</span>
              <a
                href={`mailto:${user.email}`}
                className="hover:text-blue-400 transition-colors"
              >
                Contact info
              </a>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-full text-sm font-medium transition-colors shadow-lg hover:shadow-blue-500/20"
            >
              Edit profile
            </button>
            <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-full text-sm font-medium transition-colors shadow-lg">
              More
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-6 my-6 py-4 border-y border-gray-700">
          <div className="text-center hover:text-blue-400 cursor-pointer transition-colors">
            <span className="font-bold block">{user.followersCount}</span>
            <span className="text-sm text-gray-400">Followers</span>
          </div>
          <div className="text-center hover:text-blue-400 cursor-pointer transition-colors">
            <span className="font-bold block">{user.followingCount}</span>
            <span className="text-sm text-gray-400">Following</span>
          </div>
          <div className="text-center hover:text-blue-400 cursor-pointer transition-colors">
            <span className="font-bold block">{user.postsCount}</span>
            <span className="text-sm text-gray-400">Posts</span>
          </div>
        </div>

        {/* About Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">About</h2>
          <p className="text-gray-300 leading-relaxed">{user.bio}</p>
          <div className="mt-4 flex gap-2">
            <a
              href={user.website}
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              🌐 {user.website}
            </a>
          </div>
        </div>

        {/* Experiences Section */}
        <h2 className="text-xl font-semibold mb-4">Experience</h2>
        {user.experiences && user.experiences.length > 0 && (
          <section className="mb-8">
            <div className="space-y-4">
              {user.experiences.map((exp) => (
                <div
                  key={exp.id || exp._id}
                  className="p-4 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors"
                >
                  <div className="flex items-start">
                    <div className="flex-1">
                      <h3 className="font-medium">{exp.title}</h3>
                      <p className="text-gray-300 text-sm">{exp.company}</p>
                      <p className="text-gray-400 text-sm mt-1">{exp.period}</p>
                    </div>
                  </div>
                  <p className="mt-2 text-gray-300 text-sm">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills Section */}
        <h2 className="text-xl font-semibold mb-4">Skills</h2>
        {user.skills && user.skills.length > 0 && (
          <section className="mb-8">
            <div className="flex flex-wrap gap-2">
              {user.skills.map((skill, index) => (
                <div
                  key={index}
                  className="px-3 py-1 bg-gray-800 rounded-full text-sm hover:bg-gray-750 transition-colors"
                >
                  {skill}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Posts Section */}
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        {user.posts && user.posts.length > 0 && (
          <section className="mb-8">
            <div className="space-y-4">
              {user.posts.map((post) => (
                <div
                  key={post._id}
                  className="bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors"
                >
                  <div className="flex items-center mb-3">
                    <img
                      src={user.profilePic}
                      alt="Profile"
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <div>
                      <p className="font-medium">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-gray-400 text-sm">{user.headline}</p>
                    </div>
                  </div>
                  <p className="mb-3">{post.content}</p>
                  {post.image && (
                    <img
                      src={post.image}
                      alt="Post content"
                      className="w-full h-64 object-cover rounded-lg mb-3"
                    />
                  )}
                  <div className="flex items-center text-gray-400 text-sm gap-6">
                    <button className="flex items-center gap-1 hover:text-blue-400">
                      👍 {post.reactions}
                    </button>
                    <button className="flex items-center gap-1 hover:text-blue-400">
                      💬 {post.comments}
                    </button>
                    <button className="flex items-center gap-1 hover:text-blue-400">
                      ↗️ {post.shares}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Edit Profile Modal */}
      {isModalOpen && (
        <EditProfileModal
          user={user}
          onClose={() => setIsModalOpen(false)}
          onProfileUpdated={(updatedUser) => setUser(updatedUser)}
        />
      )}
    </div>
  );
};

export default MyProfile;
