import React from "react";

const ProfileCard = () => {
  return (
    <div className="flex flex-col bg-gray-800 rounded-xl overflow-hidden shadow-lg text-white ">
      {/* Banner */}
      <div className="relative h-14">
        <img
          src="https://plus.unsplash.com/premium_photo-1701590725747-ac131d4dcffd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8d2Vic2l0ZSUyMGJhbm5lcnxlbnwwfHwwfHx8MA%3D%3D"
          alt="Banner"
          className="w-full h-full object-cover"
        />
        {/* Profile Image */}
        <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2">
          <img
            src="https://images.unsplash.com/photo-1529665253569-6d01c0eaf7b6?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D"
            alt="Profile"
            className="h-22 w-22 object-cover rounded-full border-2 border-gray-800"
          />
        </div>
      </div>

      {/* Description */}
      <div className="p-2 mt-12 text-center">
        <h3 className="text-sm font-bold">User Name</h3>
        <p className="text-gray-400 text-xs">Software Developer</p>
        <p className="text-gray-400 mt-1 text-xs">
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </p>
      </div>

      {/* Followers and Following */}
      <div className="flex justify-around p-2 border-t border-gray-700 text-xs">
        <div className="text-center">
          <p className="text-sm font-bold">5,892</p>
          <p className="text-gray-400">Followers</p>
        </div>
        <div className="h-6 w-px bg-gray-700"></div>
        <div className="text-center">
          <p className="text-sm font-bold">5,622</p>
          <p className="text-gray-400">Following</p>
        </div>
      </div>

      {/* My Profile Section */}
      <div className="p-4 border-t border-gray-700 text-center cursor-pointer hover:bg-gray-700 transition duration-300 text-xs font-semibold">
        My Profile
      </div>
    </div>
  );
};

export default ProfileCard;
