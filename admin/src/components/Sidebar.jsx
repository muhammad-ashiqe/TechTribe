import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, FileText } from 'lucide-react';

const links = [
  { name: 'Dashboard', path: '/dashboard', icon: <Home size={20} /> },
  { name: 'Users',     path: '/users',     icon: <Users size={20} /> },
  { name: 'Posts',     path: '/posts',     icon: <FileText size={20} /> },
];

export const Sidebar = () => {
  const { pathname } = useLocation();

  return (
    <aside className="hidden md:flex flex-col w-64 bg-gray-900 text-gray-200 p-6 space-y-8">
      <h2 className="text-2xl font-bold text-gray-100">TechTribe Admin</h2>

      <nav className="flex-1 space-y-2">
        {links.map(link => {
          const isActive = pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 p-3 rounded-xl transition-colors duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 shadow-lg text-white'
                  : 'hover:bg-gray-800 hover:text-gray-100 text-gray-400'
              }`}
            >
              <span className={`${isActive ? 'text-white' : 'text-indigo-400'}`}>{link.icon}</span>
              <span className="flex-1 font-medium truncate">{link.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto">
        <Link
          to="/settings"
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-800 transition-colors duration-200 text-gray-400 hover:text-gray-100"
        >
          <FileText size={20} />
          <span className="font-medium">Settings</span>
        </Link>
      </div>
    </aside>
  );
};
