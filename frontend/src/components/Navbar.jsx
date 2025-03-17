import React from "react";

const Navbar = () => {
  return (
    <div className="flex items-center justify-between px-20 py-4 bg-black shadow-lg">
      {/* Left Container */}
      <div className="left-container flex items-center space-x-6">
        {/* Logo */}
        <div className="logo-container">
          <img
            src="https://pngimg.com/d/twitter_PNG3.png"
            alt="Logo"
            className="h-10 w-10 object-cover rounded-full"
          />
        </div>

        {/* Search Input */}
        <div className="input-container relative">
          <input
            type="text"
            placeholder="Search..."
            className="w-64 px-4 py-2 bg-gray-700 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Right Container */}
      <div className="right-container flex items-center space-x-8">
        {/* Home Link */}
        <div className="home-container bg-white text-violet-600 px-5 py-2 rounded-4xl ">
          <p className=" cursor-pointer">
            <i class="fa-solid fa-house mr-2"></i>Home
          </p>
        </div>

        {/* Notifications Icon */}
        <div className="notification-icon relative">
          <p className="text-white hover:text-blue-500 transition duration-300 cursor-pointer">
            <i class="fa-solid fa-bell text-2xl"></i>
          </p>
          <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
            3
          </div>
        </div>

        {/* Profile Image */}
        <div className="profile">
          <div className="img-container">
            <img
              src="https://images.unsplash.com/photo-1529665253569-6d01c0eaf7b6?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D"
              alt="Profile"
              className="h-10 w-10 object-cover rounded-full cursor-pointer hover:opacity-80 transition duration-300"
            />
          </div>
        </div>

        {/* Menu */}
        <div className="menu-container">
          <p className="text-white hover:text-blue-500 transition duration-300 cursor-pointer">
          <i class="fa-solid fa-grip  text-2xl"></i>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
