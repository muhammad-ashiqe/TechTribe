import React from "react";
import {useNavigate} from "react-router-dom"

const LandingPage = () => {
  const Navigate = useNavigate()
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black to-gray-900 text-center p-4">
      {/* Logo or Icon */}
      <div className="mb-8">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 text-blue-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
      </div>

      {/* Heading */}
      <h1 className="text-5xl font-bold text-white mb-4 animate-fade-in">
        Welcome to <span className="text-blue-500">TechTribe</span>
      </h1>

      {/* Subheading */}
      <p className="text-gray-400 text-lg mb-8 animate-fade-in delay-100">
        Connect, Share, and Grow with Developers Worldwide
      </p>

      {/* Get Started Button */}
      <button
        className="mt-6 px-8 py-3 bg-blue-500 text-white rounded-full text-lg font-semibold hover:bg-blue-600 transition-all transform hover:scale-105 animate-fade-in delay-200"
        onClick={() => Navigate("/auth") }
      >
        Get Started
      </button>

      {/* Footer */}
      <p className="text-gray-500 text-sm mt-12 animate-fade-in delay-300">
        Already have an account?{" "}
        <a href="/login" className="text-blue-500 hover:underline">
          Log in
        </a>
      </p>
    </div>
  );
};

export default LandingPage;