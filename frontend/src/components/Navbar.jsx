import React, { useContext, useState } from "react";
import SearchBar from "./SearchBar";
import { FaHome, FaBell, FaGripHorizontal, FaSearch, FaTimes } from "react-icons/fa";
import { SocialContext } from "../context/context";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const navigate = useNavigate()

  const {user} = useContext(SocialContext)
  const toggleMobileSearch = () => {
    setShowMobileSearch(!showMobileSearch);
  };
  return (
    <div className="relative">
      {/* Mobile Search Bar - Absolute positioned overlay */}
      {showMobileSearch && (
        <div className="sm:hidden absolute top-0 left-0 right-0 z-50 bg-black p-3 border-b border-gray-800 flex items-center">
          {/* Logo - Visible in mobile search mode */}
          <div className="flex-shrink-0 mr-2">
            <img
              src="https://pngimg.com/d/twitter_PNG3.png"
              alt="Logo"
              className="h-8 w-8 object-cover rounded-full"
            />
          </div>
          
          {/* Search Input - Takes remaining space */}
          <div className="flex-grow mx-2">  {/* Added mx-2 for horizontal spacing */}
            <SearchBar />
          </div>
          
          {/* Close Button with more spacing */}
          <button 
            onClick={toggleMobileSearch}
            className="flex-shrink-0 text-gray-400 hover:text-white ml-2"  // ml-2 provides spacing
          >
            <FaTimes className="text-xl" />
          </button>
        </div>
      )}

      {/* Rest of your navbar code remains exactly the same */}
      <div className={`flex items-center justify-between px-4 sm:px-6 md:px-10 lg:px-20 py-3 bg-black border-b border-gray-800 sticky top-0 z-40 ${showMobileSearch ? 'sm:opacity-100 opacity-0' : 'opacity-100'}`}>
        {/* Left Container */}
        <div className="flex items-center space-x-4 sm:space-x-6 w-full max-w-[600px]">
          {/* Logo */}
          <div className="flex-shrink-0">
            <img
              src="https://pngimg.com/d/twitter_PNG3.png"
              alt="Logo"
              className="h-8 w-8 sm:h-10 sm:w-10 object-cover rounded-full hover:opacity-90 transition"
            />
          </div>

          {/* Search Input - Hidden on small screens */}
          <div className="hidden sm:block flex-grow">
            <SearchBar />
          </div>
        </div>

        {/* Right Container */}
        <div className="flex items-center space-x-4 sm:space-x-6">
          {/* Mobile Search Icon - Shows only on small screens */}
          <div 
            className="sm:hidden text-white cursor-pointer"
            onClick={toggleMobileSearch}
          >
            <FaSearch className="h-5 w-5" />
          </div>

          {/* Home Link */}
          <div className="hidden sm:flex items-center bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition cursor-pointer">
            <FaHome className="mr-2" />
            <span className="font-medium">Home</span>
          </div>

          {/* Notifications Icon */}
          <div className="relative">
            <div className="text-gray-200 hover:text-blue-400 transition cursor-pointer p-2">
              <FaBell className="text-xl sm:text-2xl" />
              <div className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                3
              </div>
            </div>
          </div>

          {/* Profile Image */}
          <div className="flex-shrink-0" onClick={()=>navigate('/myprofile')}>
            <img
              src={user.profilePic}
              alt="Profile"
              className="h-8 w-8 sm:h-10 sm:w-10 object-cover rounded-full cursor-pointer hover:opacity-80 transition border-2 border-transparent hover:border-blue-500"
            />
          </div>

          {/* Menu */}
          <div className="hidden sm:hidden text-gray-200 hover:text-blue-400 transition cursor-pointer p-2">
            <FaGripHorizontal className="text-xl sm:text-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;