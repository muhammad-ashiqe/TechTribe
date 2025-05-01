import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon,
  UserGroupIcon,
  DocumentTextIcon,
  Cog6ToothIcon 
} from '@heroicons/react/24/outline';

const links = [
  { name: 'Dashboard', path: '/dashboard', icon: <HomeIcon className="w-6 h-6" /> },
  { name: 'Users', path: '/users', icon: <UserGroupIcon className="w-6 h-6" /> },
  { name: 'Posts', path: '/posts', icon: <DocumentTextIcon className="w-6 h-6" /> },
];

export const Sidebar = () => {
  const { pathname } = useLocation();

  return (
    <aside className="hidden md:flex flex-col w-64 bg-gradient-to-b from-gray-900 to-gray-800 border-r border-gray-700 p-6 space-y-2 shadow-2xl">
      {/* Header */}
      <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-8">
        TechTribe Admin
      </h2>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-2">
        {links.map(link => {
          const isActive = pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg text-white'
                  : 'hover:bg-gray-800/30 text-gray-400 hover:text-gray-200'
              }`}
            >
              <span className={`${isActive ? 'text-white' : 'text-blue-400'}`}>
                {link.icon}
              </span>
              <span className="font-medium">{link.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Settings Link */}
      <div className="mt-auto">
        <Link
          to="/settings"
          className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-300 ${
            pathname === '/settings'
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
              : 'hover:bg-gray-800/30 text-gray-400 hover:text-gray-200'
          }`}
        >
          <Cog6ToothIcon className={`w-6 h-6 ${pathname === '/settings' ? 'text-white' : 'text-purple-400'}`} />
          <span className="font-medium">Settings</span>
        </Link>
      </div>
    </aside>
  );
};