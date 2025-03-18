import React from 'react'

const TendingTopics = () => {
  return (
    <div className="bg-gray-800 rounded-xl p-4 text-white">
            {/* Title */}
            <h2 className="text-lg font-bold">Trending in Tech</h2>

            {/* Topic 1 */}
            <div className="flex justify-between items-center mt-3">
              <div>
                <p className="text-md font-semibold">#AI</p>
                <p className="text-gray-400 text-xs">Artificial Intelligence</p>
              </div>
              <p className="text-gray-400 text-xs">12.5K discussions</p>
            </div>

            {/* Topic 2 */}
            <div className="flex justify-between items-center mt-3">
              <div>
                <p className="text-md font-semibold">#Web3</p>
                <p className="text-gray-400 text-xs">Blockchain & Web3</p>
              </div>
              <p className="text-gray-400 text-xs">9.8K discussions</p>
            </div>

            {/* Topic 3 */}
            <div className="flex justify-between items-center mt-3">
              <div>
                <p className="text-md font-semibold">#CyberSec</p>
                <p className="text-gray-400 text-xs">Cybersecurity</p>
              </div>
              <p className="text-gray-400 text-xs">8.2K discussions</p>
            </div>

            {/* Topic 4 */}
            <div className="flex justify-between items-center mt-3">
              <div>
                <p className="text-md font-semibold">#CloudTech</p>
                <p className="text-gray-400 text-xs">Cloud Computing</p>
              </div>
              <p className="text-gray-400 text-xs">7.5K discussions</p>
            </div>

            {/* Topic 5 */}
            <div className="flex justify-between items-center mt-3">
              <div>
                <p className="text-md font-semibold">#MERN</p>
                <p className="text-gray-400 text-xs">MERN Stack Development</p>
              </div>
              <p className="text-gray-400 text-xs">6.3K discussions</p>
            </div>

            {/* See More */}
            <div className="mt-4 text-center">
              <p className="text-blue-500 cursor-pointer hover:underline text-sm">
                See more trends
              </p>
            </div>
          </div>
  )
}

export default TendingTopics
