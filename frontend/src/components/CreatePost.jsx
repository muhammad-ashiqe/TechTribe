import React from "react";

const CreatePost = () => {
  return (
    <div className="post-content w-full p-4 bg-gray-800 rounded-2xl">
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="avatar-div">
          <img
            className="w-12 h-12 rounded-full object-cover"
            src="https://images.unsplash.com/photo-1529665253569-6d01c0eaf7b6?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D"
            alt="Profile"
          />
        </div>

        {/* Input Field */}
        <div className="input-div flex-1">
          <input
            type="text"
            placeholder="What's happening?"
            className="w-full p-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Post Button */}
        <button className="bg-white p-2 rounded-full hover:bg-blue-600 transition-colors">
          <img
            className="w-6 h-6"
            src="https://cdn-icons-png.flaticon.com/512/4926/4926616.png"
            alt="Post"
          />
        </button>
      </div>

      {/* Bottom Div*/}
      <div className="bottom-div flex items-center justify-center px-15 gap-4 mt-4 w-full">
        <div className="image-div flex-1 flex gap-2 items-center justify-center border border-gray-700 p-2 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors">
        <i className="fa-regular fa-image"></i>
          <p className="text-sm text-gray-400">Image</p>
        </div>
        <div className="thread-div flex-1 flex gap-2 items-center justify-center border border-gray-700 p-2 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors">
        <i className="fa-regular fa-file-lines"></i>
          <p className="text-sm text-gray-400">Thread</p>
        </div>
        <div className="schedule-div flex-1 flex gap-2 items-center justify-center border border-gray-700 p-2 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors">
        <i class="fa-regular fa-calendar"></i>
          <p className="text-sm text-gray-400">Schedule</p>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
