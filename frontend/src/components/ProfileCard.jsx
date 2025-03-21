import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const ProfileCard = () => {
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

  
  return (
    <div className="flex flex-col bg-gray-800 rounded-xl overflow-hidden shadow-lg text-white ">
      {/* Banner */}
      <div className="relative h-14">
        <img
          src="https://plus.unsplash.com/premium_photo-1701590725747-ac131d4dcffd?w=600&auto=format&fit=crop&q=60"
          alt="Banner"
          className="w-full h-full object-cover"
        />
        {/* Profile Image */}
        <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2">
          <img
            src={user.profilePic || "https://via.placeholder.com/100"}
            alt="Profile"
            className="h-22 w-22 object-cover rounded-full border-2 border-gray-800"
          />
        </div>
      </div>

      {/* Description */}
      <div className="p-2 mt-12 text-center">
        <h3 className="text-sm font-bold">{user.firstName} {user.lastName}</h3>
        <p className="text-gray-400 text-xs">{user.jobTitle || "Software Developer"}</p>
        <p className="text-gray-400 mt-1 text-xs">{user.bio || "Lorem ipsum dolor sit amet consectetur adipisicing elit."}</p>
      </div>

      {/* Followers and Following */}
      <div className="flex justify-around p-2 border-t border-gray-700 text-xs">
        <div className="text-center">
          <p className="text-sm font-bold">{user.followers}</p>
          <p className="text-gray-400">Followers</p>
        </div>
        <div className="h-6 w-px bg-gray-700"></div>
        <div className="text-center">
          <p className="text-sm font-bold">{user.following}</p>
          <p className="text-gray-400">Following</p>
        </div>
      </div>

      {/* My Profile Section */}
      <div onClick={()=>navigate("/myprofile")} className="p-4 border-t border-gray-700 text-center cursor-pointer hover:bg-gray-700 transition duration-300 text-xs font-semibold">
        My Profile
      </div>
    </div>
  );
};

export default ProfileCard;
