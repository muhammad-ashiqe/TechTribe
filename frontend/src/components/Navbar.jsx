import React, { useContext, useState } from "react";
import SearchBar from "./SearchBar";
import { SocialContext } from "../context/context";
import { useNavigate } from "react-router-dom";
import { HomeIcon, BellIcon, UserCircleIcon, XMarkIcon, MagnifyingGlassIcon, Squares2X2Icon } from "@heroicons/react/24/outline";
import { HomeModernIcon, BellAlertIcon } from "@heroicons/react/24/solid";

const Navbar = () => {
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const navigate = useNavigate();
  const { user } = useContext(SocialContext);

  const toggleMobileSearch = () => setShowMobileSearch(!showMobileSearch);

  return (
    <div className="relative">
      {/* Mobile Search Overlay */}
      {showMobileSearch && (
        <div className="sm:hidden absolute top-0 inset-x-0 z-50 bg-gradient-to-br from-gray-900 to-gray-800 p-4 border-b border-gray-700 flex items-center shadow-2xl">
          <div className="flex-1 mr-4">
            <SearchBar />
          </div>
          <button 
            onClick={toggleMobileSearch}
            className="p-2 hover:bg-gray-700/30 rounded-full transition-all duration-300"
          >
            <XMarkIcon className="w-6 h-6 text-gray-400 hover:text-white" />
          </button>
        </div>
      )}

      {/* Main Navbar */}
      <div className={`flex items-center justify-between px-4 md:px-8 py-3 bg-gradient-to-br from-gray-900 to-gray-800 border-b border-gray-700 sticky top-0 z-40 shadow-2xl ${showMobileSearch ? 'sm:opacity-100 opacity-0' : 'opacity-100'}`}>
        {/* Left Section */}
        <div className="flex items-center space-x-4 md:space-x-6 flex-1 max-w-3xl">
          {/* Logo */}
          <div 
            className="flex-shrink-0 cursor-pointer hover:opacity-90 transition-all duration-300"
            onClick={() => navigate('/')}
          >
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-xl">
              <HomeModernIcon className="w-6 h-6 text-white" />
            </div>
          </div>

          {/* Desktop Search */}
          <div className="hidden sm:block flex-1">
            <SearchBar />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4 md:space-x-6">
          {/* Mobile Search Trigger */}
          <button
            className="sm:hidden p-2 hover:bg-gray-700/30 rounded-full transition-all duration-300"
            onClick={toggleMobileSearch}
          >
            <MagnifyingGlassIcon className="w-6 h-6 text-gray-400 hover:text-blue-400" />
          </button>

          {/* Home Navigation */}
          <button
            className="hidden sm:flex items-center bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 px-4 py-2 rounded-xl transition-all duration-300"
            onClick={() => navigate('/')}
          >
            <HomeIcon className="w-5 h-5 text-white mr-2" />
            <span className="text-white font-medium">Home</span>
          </button>

          {/* Notifications */}
          <div className="relative group">
            <button className="p-2 hover:bg-gray-700/30 rounded-full transition-all duration-300">
              <BellIcon className="w-6 h-6 text-gray-400 group-hover:text-blue-400" />
              <div className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shadow">
                3
              </div>
            </button>
          </div>

          {/* Profile */}
          <div 
            className="relative group cursor-pointer"
            onClick={() => navigate('/myprofile')}
          >
            {user?.profilePic ? (
              <img
                src={user.profilePic}
                alt="Profile"
                className="h-10 w-10 object-cover rounded-full border-2 border-gray-700 group-hover:border-blue-400 transition-all duration-300"
              />
            ) : (
              <UserCircleIcon className="h-10 w-10 text-gray-400 group-hover:text-blue-400 transition-all duration-300" />
            )}
          </div>

          {/* Menu (Optional) */}
          <button className="hidden lg:flex p-2 hover:bg-gray-700/30 rounded-xl transition-all duration-300">
            <Squares2X2Icon className="w-6 h-6 text-gray-400 hover:text-purple-400" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;