import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import EditProfileModal from "../components/EditProfileModal";
import EditSkillsModal from "../components/EditSkillsModal"; // Import the new modal
import MyPost from "../components/MyPost";
import { toast } from "react-toastify";

const MyProfile = () => {
  const [user, setUser] = useState(null);
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSkillsModalOpen, setIsSkillsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleDeletePost = async (postId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:7000/api/post/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (!response.ok) {
        toast.error("Something went wrong");
        throw new Error('Failed to delete post');
      }
  
      // Remove the post from state
      setRecentPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
      toast.success("Post deleted successfully");
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/auth");
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

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
  
        const { data } = await axios.get(
          "http://localhost:7000/api/post/my-posts",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        setRecentPosts(data); // Store posts in state
        console.log("User posts fetched:", data);
      } catch (err) {
        console.error("Failed to fetch user posts:", err.response?.data || err.message);
      }
    };
  
    fetchUserPosts();
  }, []); // Runs once on component mount
  
  

  if (loading) return <div>Loading profile...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="max-w-4xl mx-auto bg-gray-900 min-h-screen text-white overflow-hidden mt-10 rounded-t-2xl">
      {/* Cover Photo */}
      <div className="relative h-48 sm:h-64 group">
        <img
          src={user.coverPhoto || ""}
          alt="Cover"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
        <div className="absolute -bottom-8 left-4 sm:left-8">
          <img
            src={user.profilePic || ""}
            alt="Profile"
            className="w-20 h-20 sm:w-32 sm:h-32 rounded-full border-4 border-gray-900 object-cover shadow-xl transition-transform duration-300 hover:scale-105"
          />
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
              <a href={`mailto:${user.email}`} className="hover:text-blue-400 transition-colors">
                Contact info
              </a>
              <p>{user.website}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-full text-sm font-medium transition-colors shadow-lg"
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
          <div className="text-center">
            <span className="font-bold block">{user.followers?.length || 0}</span>
            <span className="text-sm text-gray-400">Followers</span>
          </div>
          <div className="text-center">
            <span className="font-bold block">{user.following?.length || 0}</span>
            <span className="text-sm text-gray-400">Following</span>
          </div>
          <div className="text-center">
            <span className="font-bold block">{user.posts?.length || 0}</span>
            <span className="text-sm text-gray-400">Posts</span>
          </div>
        </div>

        {/* Bio Section */}
        <div className="bio mb-6">
          <p>{user.bio}</p>
        </div>

        {/* Skills Section */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-xl font-semibold mb-2">Skills</h1>
            <div className="text-gray-300 flex gap-5 flex-wrap">
              {user.skills && user.skills.length > 0 ? user.skills.map((skill)=>( <p className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-full text-sm font-medium transition-colors shadow-lg">{skill}</p> )) : "No skills added yet."}
            </div>
          </div>
          <button
            onClick={() => setIsSkillsModalOpen(true)}
            className="px-4 py-2 bg-green-600 hover:bg-blue-700 rounded-full text-sm font-medium transition-colors shadow-lg"
          >
            Update skills
          </button>
        </div>

        {/* Experience Section */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-xl font-semibold mb-2">Experience</h1>
            <hr />
          </div>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-full text-sm font-medium transition-colors shadow-lg">
            Add Experience
          </button>
        </div>

        {/* Recent Activity */}
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <hr className="mb-2" />
        {recentPosts.length > 0 ? (
          <section className="mb-8">
            <div className="space-y-4">
              {recentPosts.map((post, index) => (
                <MyPost key={index} post={post} handleDeletePost={handleDeletePost} />
              ))}
            </div>
          </section>
        ) : (
          <p className="text-gray-400">No recent activity found.</p>
        )}
      </div>

      {/* Modals */}
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
            setUser((prevUser) => ({ ...prevUser, skills: updatedSkills }))
          }
        />
      )}
    </div>
  );
};

export default MyProfile;
