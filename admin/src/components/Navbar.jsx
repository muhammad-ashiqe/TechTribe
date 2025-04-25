import React from 'react';
import { Bell, Settings, Menu } from 'lucide-react';

const Navbar = ({ onMenuToggle }) => {
  return (
    <header className="w-full bg-gray-900 px-4 sm:px-6 py-3 sm:py-4 flex items-center shadow-lg">
      {/* Hamburger menu for mobile */}
      <button
        className="md:hidden p-2 rounded-md hover:bg-gray-800 transition-colors mr-2"
        onClick={onMenuToggle}
      >
        <Menu className="w-6 h-6 text-gray-400" />
      </button>

      {/* Title */}
      <h1 className="flex-1 text-lg sm:text-xl font-bold text-gray-100 truncate">
        TechTribe Admin Panel
      </h1>

      {/* Actions */}
      <div className="flex items-center gap-4 sm:gap-6">
        <button className="p-2 rounded-md hover:bg-gray-800 transition-colors">
          <Bell className="w-5 h-5 text-gray-400" />
        </button>
        <button className="p-2 rounded-md hover:bg-gray-800 transition-colors">
          <Settings className="w-5 h-5 text-gray-400" />
        </button>

        {/* User Info */}
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="hidden sm:block text-sm text-gray-400 truncate">
            admin@techtribe.com
          </span>
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-700 rounded-full ring-2 ring-indigo-500 flex-shrink-0" />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
