import { useContext } from 'react';
import { 
  BellIcon, 
  Cog6ToothIcon, 
  Bars3Icon,
  ArrowRightOnRectangleIcon 
} from '@heroicons/react/24/outline';
import { SocialContext } from '../Context';

const Navbar = ({ onMenuToggle }) => {
  const { logout } = useContext(SocialContext);

  return (
    <header className="w-full bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4 flex items-center justify-between shadow-2xl border-b border-gray-700">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <button
          className="md:hidden p-2 hover:bg-gray-700/30 rounded-xl transition-all duration-300"
          onClick={onMenuToggle}
        >
          <Bars3Icon className="w-6 h-6 text-gray-300" />
        </button>
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          TechTribe Admin
        </h1>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-gray-700/30 rounded-xl transition-all duration-300">
          <BellIcon className="w-6 h-6 text-gray-300" />
        </button>
        
        <button className="p-2 hover:bg-gray-700/30 rounded-xl transition-all duration-300">
          <Cog6ToothIcon className="w-6 h-6 text-gray-300" />
        </button>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="p-2 hover:bg-red-600/20 rounded-xl transition-all duration-300 group relative"
          title="Logout"
        >
          <ArrowRightOnRectangleIcon className="w-6 h-6 text-gray-300 group-hover:text-red-400" />
          <span className="absolute -bottom-8 right-0 bg-red-500 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Logout
          </span>
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3 group">
          <span className="text-sm bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            admin@techtribe.com
          </span>
          <div className="w-8 h-8 rounded-full border-2 border-gray-600 group-hover:border-blue-400 transition-all duration-300 overflow-hidden">
            <img 
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBhjoZmqCRAQ5zUbhsMXksI0DgZnK-ThRSSuQgBVJKHP9VjkE6v2BturFKr_oprzUD1XM&usqp=CAU" 
              alt="Admin avatar"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;