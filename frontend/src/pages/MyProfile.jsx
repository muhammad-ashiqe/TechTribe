import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import EditProfileModal from "../components/EditProfileModal";
import EditSkillsModal from "../components/EditSkillsModal";
import MyPost from "../components/MyPost";
import { toast } from "react-toastify";
import AddExperienceModal from "../components/AddExperienceModal";
import ExperienceDisplay from "../components/ExperienceDisplay";
import { SocialContext } from "../context/context";
import {
  UserCircleIcon,
  BriefcaseIcon,
  PlusIcon,
  PencilIcon
} from "@heroicons/react/24/outline";
import { ArrowPathIcon } from "@heroicons/react/24/solid";

const MyProfile = () => {
  const [user, setUser] = useState(null);
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSkillsModalOpen, setIsSkillsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { baseUrl, token } = useContext(SocialContext);
  const [isExperienceModalOpen, setIsExperienceModalOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/auth");
    toast.success("Logged out successfully");
  };

  const handleExperienceAdded = (newExperiences) => {
    setUser((prev) => ({ ...prev, experiences: newExperiences }));
  };

  const handleExperienceDeleted = (deletedExpId) => {
    if (deletedExpId) {
      setUser((prev) => ({
        ...prev,
        experiences: prev.experiences.filter((exp) => exp._id !== deletedExpId),
      }));
    } else {
      fetchUserProfile();
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      const response = await fetch(`${baseUrl}/post/${postId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        toast.error("Something went wrong");
        throw new Error("Failed to delete post");
      }

      setRecentPosts((prevPosts) =>
        prevPosts.filter((post) => post._id !== postId)
      );
      toast.success("Post deleted successfully");
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Something went wrong");
    }
  };

  const fetchUserProfile = async () => {
    try {
      if (!token) {
        navigate("/auth");
        return;
      }
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.get(`${baseUrl}/user/profile`, config);
      setUser(data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [navigate]);

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        if (!token) return;

        const { data } = await axios.get(`${baseUrl}/post/my-posts`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setRecentPosts(data);
      } catch (err) {
        console.error(
          "Failed to fetch user posts:",
          err.response?.data || err.message
        );
      }
    };

    fetchUserPosts();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <ArrowPathIcon className="w-12 h-12 text-blue-400 animate-spin" />
      </div>
    );

  if (error)
    return (
      <div className="text-center py-8 text-gray-400 bg-gray-900 min-h-screen">
        <UserCircleIcon className="w-16 h-16 mx-auto mb-4 text-gray-600" />
        <p className="text-xl font-medium">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:opacity-90 transition-opacity"
        >
          Try Again
        </button>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto bg-gradient-to-b from-gray-900 to-gray-800 min-h-screen text-white overflow-hidden">
      <div className="relative h-48 sm:h-64 group">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20" />
        {user.coverPhoto && (
          <img
            src={user.coverPhoto}
            alt="Cover"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => (e.target.style.display = "none")}
          />
        )}
        <div className="absolute -bottom-8 left-4 sm:left-8">
          {user.profilePic ? (
            <img
              src={user.profilePic}
              alt="Profile"
              className="w-20 h-20 sm:w-32 sm:h-32 rounded-full border-4 border-gray-900 object-cover shadow-xl transition-transform duration-300 hover:scale-105"
            />
          ) : (
            <UserCircleIcon className="w-32 h-32 text-gray-400" />
          )}
        </div>
      </div>

      <div className="px-4 sm:px-8 pt-16 sm:pt-24 pb-8 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {user.firstName} {user.lastName}
            </h1>
            <p className="text-gray-300 text-lg">{user.headline}</p>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span>{user.location}</span>
              <a
                href={`mailto:${user.email}`}
                className="hover:text-blue-400 transition-colors border-b border-dashed border-gray-500"
              >
                Contact info
              </a>
              <a
                href={user.website}
                className="text-blue-400 hover:text-purple-400"
              >
                Portfolio
              </a>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2"
            >
              <PencilIcon className="w-4 h-4" />
              Edit Profile
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center py-4 border-y border-gray-700">
          <div className="flex-1 text-left pr-4 border-r border-gray-700">
            <p className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {user.followersCount || 0}
            </p>
            <p className="text-xs text-gray-400 mt-1 tracking-wider">
              FOLLOWERS
            </p>
          </div>
          <div className="flex-1 text-left px-4 border-r border-gray-700">
            <p className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {user.followingCount || 0}
            </p>
            <p className="text-xs text-gray-400 mt-1 tracking-wider">
              FOLLOWING
            </p>
          </div>
          <div className="flex-1 text-left pl-4">
            <p className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {recentPosts?.length || 0}
            </p>
            <p className="text-xs text-gray-400 mt-1 tracking-wider">POSTS</p>
          </div>
        </div>

        <div className="p-4 bg-gray-800/50 rounded-2xl border border-gray-700">
          <p className="text-gray-300 whitespace-pre-line">
            {user.bio || "No bio added yet"}
          </p>
        </div>

        <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Skills & Expertise
            </h2>
            <button
              onClick={() => setIsSkillsModalOpen(true)}
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-400 hover:to-blue-400 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2"
            >
              <PlusIcon className="w-4 h-4" />
              Add Skills
            </button>
          </div>
          <div className="flex flex-wrap gap-3">
            {user.skills?.length > 0 ? (
              user.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400 rounded-full text-sm border border-blue-400/30"
                >
                  {skill}
                </span>
              ))
            ) : (
              <p className="text-gray-400">No skills added yet</p>
            )}
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Experience
            </h2>
            <button
              onClick={() => setIsExperienceModalOpen(true)}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2"
            >
              <BriefcaseIcon className="w-4 h-4" />
              Add Experience
            </button>
          </div>
          <ExperienceDisplay
            experiences={user.experiences || []}
            onExperienceDeleted={handleExperienceDeleted}
            editable={true}
          />
        </div>

        <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-4">
          <h2 className="text-xl font-semibold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Recent Activity
          </h2>
          <div className="space-y-4">
            {recentPosts.length > 0 ? (
              recentPosts.map((post) => (
                <MyPost
                  key={post._id}
                  post={post}
                  handleDeletePost={handleDeletePost}
                />
              ))
            ) : (
              <div className="p-4 text-center text-gray-400 rounded-xl bg-gray-900/50">
                No posts found. Share your first update!
              </div>
            )}
          </div>
        </div>
        <hr />

        <div className="flex items-center justify-center text-center">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-full px-4 py-2  hover:bg-red-500 hover:text-white rounded-xl  transition-all duration-300 text-red-600 font-bold text-xl gap-2 cursor-pointer "
          >
            Logout
          </button>
        </div>
      </div>

      {isProfileModalOpen && (
        <EditProfileModal
          user={user}
          onClose={() => setIsProfileModalOpen(false)}
          onProfileUpdated={(updatedUser) => setUser(updatedUser)}
        />
      )}
      {isSkillsModalOpen && (
        <EditSkillsModal
          user={user}
          onClose={() => setIsSkillsModalOpen(false)}
          onSkillsUpdated={(updatedSkills) =>
            setUser((prev) => ({ ...prev, skills: updatedSkills }))
          }
        />
      )}
      {isExperienceModalOpen && (
        <AddExperienceModal
          user={user}
          onClose={() => setIsExperienceModalOpen(false)}
          onExperienceAdded={handleExperienceAdded}
        />
      )}
    </div>
  );
};

export default MyProfile;
