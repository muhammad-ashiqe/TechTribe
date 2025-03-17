import React from "react";
import Navbar from "../components/Navbar";
import ProfileCard from "../components/ProfileCard";
import SuggestionToFollow from "../components/SuggestionToFollow";

const Home = () => {
  return (
    <>
      <Navbar />
      <div className="home flex w-full justify-center bg-black min-h-screen text-white p-6 gap-3">
        <div className="w-[20%] h-screen overflow-y-auto">
          {/* Profile Card */}
          <div className="mb-3">
            <ProfileCard />
          </div>

          {/* Suggestions to Follow */}
          <div>
            <SuggestionToFollow />
          </div>
        </div>

        {/* Middle Section */}
        <div className="mid w-[50%] h-[82vh] bg-gray-800 rounded-xl min-h-[80vh] shadow-lg flex justify-center items-center">
          <p className="text-gray-400">Feed will be displayed here</p>
        </div>

        {/* Right Section (Empty for now) */}
        <div className="right w-[25%] ">
          {/* Subscribe to Premium */}
          <div className="bg-gray-800 rounded-xl p-4 text-white mb-3">
            <h2 className="text-lg font-bold">Subscribe to Premium</h2>
            <p className="text-sm text-gray-400 mt-1">
              Unlock exclusive benefits & grow your tech career!
            </p>
            <button className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg mt-3 hover:bg-blue-700 transition">
              Subscribe Now
            </button>
          </div>

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
        </div>
      </div>
    </>
  );
};

export default Home;
