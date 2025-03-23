import React, { useEffect, useState } from "react";
import CreatePostModal from "./CreatePostModal"; // Import the modal component
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreatePost = () => {
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility
  const [user, setUser] = useState(null);
  
    const navigate = useNavigate()
    useEffect(() => {
      const fetchUserProfile = async () => {
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            console.error("No token found. User must log in.");
            return;
          }
  
          const config = { headers: { Authorization: `Bearer ${token}` } };
          const { data } = await axios.get("http://localhost:7000/api/user/profile", config);
          setUser(data);
        } catch (error) {
          console.error("Error fetching user profile:", error.response?.data?.message || error.message);
        }
      };
  
      fetchUserProfile();
    }, []);
  
    if (!user) return <p>Loading...</p>;
  
    
    // Function to handle option clicks
    const handleOptionClick = () => {
      setIsModalOpen(true); // Open the modal
    };
    
    console.log(user)
  return (
    <div className="post-content w-full p-4 bg-gray-800 rounded-2xl">
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="avatar-div">
          <img
            className="w-12 h-12 rounded-full object-cover"
            src={user.profilePic}
            alt="Profile"
          />
        </div>

        {/* Input Field */}
        <div className="input-div flex-1">
          <input
            type="text"
            placeholder="What's happening?"
            className="w-full p-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Post Button */}
        <button
          className="bg-white p-2 rounded-full hover:bg-blue-600 transition-colors"
          onClick={handleOptionClick} // Open modal when Post button is clicked
        >
          <img
            className="w-6 h-6"
            src="https://cdn-icons-png.flaticon.com/512/4926/4926616.png"
            alt="Post"
          />
        </button>
      </div>

      {/* Bottom Div */}
      <div className="bottom-div flex items-center justify-center px-15 gap-4 mt-4 w-full">
        {/* Image Option */}
        <div
          className="image-div flex-1 flex gap-2 items-center justify-center border border-gray-700 p-2 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors"
          onClick={handleOptionClick} // Open modal when Image option is clicked
        >
          <i className="fa-regular fa-image"></i>
          <p className="text-sm text-gray-400">Image</p>
        </div>

        {/* Thread Option */}
        <div
          className="thread-div flex-1 flex gap-2 items-center justify-center border border-gray-700 p-2 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors"
          onClick={handleOptionClick} // Open modal when Thread option is clicked
        >
          <i className="fa-regular fa-file-lines"></i>
          <p className="text-sm text-gray-400">Thread</p>
        </div>
      </div>

      {/* Modal */}
      <CreatePostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)} // Close modal
      />
    </div>
  );
};

export default CreatePost;