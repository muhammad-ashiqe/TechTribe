import React from "react";
import { SparklesIcon } from "@heroicons/react/24/solid";

const SubscribeToPremium = () => {
  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-gray-700 shadow-2xl relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10"></div>
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <SparklesIcon className="w-8 h-8 text-yellow-400" />
          <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Go Premium
          </h2>
        </div>
        
        <ul className="space-y-2.5 mb-6">
          <li className="flex items-center gap-2 text-gray-300 text-sm">
            <SparklesIcon className="w-4 h-4 text-blue-400" />
            Exclusive tech career resources
          </li>
          <li className="flex items-center gap-2 text-gray-300 text-sm">
            <SparklesIcon className="w-4 h-4 text-purple-400" />
            Premium learning content
          </li>
          <li className="flex items-center gap-2 text-gray-300 text-sm">
            <SparklesIcon className="w-4 h-4 text-blue-400" />
            Verified profile badge
          </li>
        </ul>

        <button className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white font-medium flex items-center justify-center gap-2 transition-all duration-300 group">
          <span>Upgrade Now</span>
          <SparklesIcon className="w-5 h-5 text-yellow-300 group-hover:animate-pulse" />
        </button>
      </div>
    </div>
  );
};

export default SubscribeToPremium;