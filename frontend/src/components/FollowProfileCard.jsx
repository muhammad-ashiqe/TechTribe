import React from "react";

const FollowProfileCard = () => {
  return (
    <div className="flex items-center justify-between bg-gray-800 rounded-lg p-2 text-white ">
      {/* Profile Image and Description */}
      <div className="flex items-center space-x-2">
        <div className="img-container">
          <img
            src="https://www.rspcasa.org.au/wp-content/uploads/2024/08/Cat-Management-Act-Review-2.png"
            alt="Profile"
            className="h-12 w-12 object-cover rounded-full border-2 border-gray-800"
          />
        </div>
        <div className="profile-description">
          <h3 className="text-sm font-bold">User One</h3>
          <p className="text-gray-400 text-xs">Cyber Security Specialist</p>
        </div>
      </div>

      {/* Follow Button */}
      <div className="follow-button">
        <button className="bg-blue-600 px-3 py-1 rounded-md text-xs font-semibold hover:bg-blue-700 transition duration-300">
          Follow
        </button>
      </div>
    </div>
  );
};

export default FollowProfileCard;
