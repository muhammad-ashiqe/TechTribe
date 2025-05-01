import React from 'react';
import { BellIcon, Cog6ToothIcon, Bars3Icon } from '@heroicons/react/24/outline';

const Navbar = ({ onMenuToggle }) => {
  return (
    <header className="w-full bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4 flex items-center justify-between shadow-2xl border-b border-gray-700">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 hover:bg-gray-700/30 rounded-xl transition-all duration-300"
          onClick={onMenuToggle}
        >
          <Bars3Icon className="w-6 h-6 text-gray-300" />
        </button>

        {/* Title */}
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          TechTribe Admin
        </h1>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="p-2 hover:bg-gray-700/30 rounded-xl transition-all duration-300">
          <BellIcon className="w-6 h-6 text-gray-300" />
        </button>

        {/* Settings */}
        <button className="p-2 hover:bg-gray-700/30 rounded-xl transition-all duration-300">
          <Cog6ToothIcon className="w-6 h-6 text-gray-300" />
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3 group">
          <span className="text-sm bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            admin@techtribe.com
          </span>
          <div className="w-8 h-8 rounded-full border-2 border-gray-600 group-hover:border-blue-400 transition-all duration-300 overflow-hidden">
            <img 
              src="/path-to-admin-avatar.png" 
              alt="Admin avatar"
              className="w-full h-full object-cover"
              onError={(e) => e.target.src = '/default-avatar.png'}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;