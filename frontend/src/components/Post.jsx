import React from "react";

const Post = () => {
  return (
    <div className="post-container bg-gray-800 rounded-lg p-4 mb-4 shadow-lg">
      {/* Post Top Section */}
      <div className="post-top-div flex items-start gap-3">
        {/* Profile Image */}
        <div className="profile">
          <img
            className="w-12 h-12 rounded-full object-cover"
            src="https://images.unsplash.com/photo-1529665253569-6d01c0eaf7b6?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D"
            alt="Profile"
          />
        </div>

        {/* Profile Description */}
        <div className="profile-description flex-1">
          <div className="name-designation">
            <h3 className="text-white font-bold">User Name</h3>
            <p className="text-sm text-gray-400">Software Developer</p>
          </div>
          <div className="time">
            <p className="text-xs text-gray-500">Posted 4m ago</p>
          </div>
        </div>
      </div>

      {/* Post Middle Section */}
      <div className="post-middle-div mt-4">
        {/* Image Container */}
        <div className="img-container">
          <img
            className="w-full h-auto rounded-lg"
            src="https://a-static.besthdwallpaper.com/deadpool-and-moon-size-behind-him-wallpaper-1920x1440-102297_25.jpg"
            alt="Post Image"
          />
        </div>

        {/* Post Description */}
        <div className="post-description mt-3">
          <p className="text-white">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Repellat,
            est voluptates veniam quidem ea vel optio maxime assumenda eveniet,
            sint atque a blanditiis nesciunt quia beatae quod itaque veritatis
            quam.
          </p>
        </div>
      </div>

      {/* Analytics Section */}
      <div className="analytics flex justify-between mt-4 text-gray-400">
        <div className="reactions">
          <p>20k reactions</p>
        </div>
        <div className="comments">
          <p>2k comments</p>
        </div>
      </div>

      {/* Post Bottom Section */}
      <div className="post-bottom-div flex justify-around mt-4 border-t border-gray-700 pt-3">
        <div className="like flex items-center gap-2 cursor-pointer hover:text-red-500 transition-colors">
          <i className="fa-regular fa-heart text-lg"></i>
          <p>Like</p>
        </div>
        <div className="comment flex items-center gap-2 cursor-pointer hover:text-blue-500 transition-colors">
          <i className="fa-regular fa-comment text-lg"></i>
          <p>Comment</p>
        </div>
        <div className="share flex items-center gap-2 cursor-pointer hover:text-green-500 transition-colors">
          <i className="fa-solid fa-share-nodes text-lg"></i>
          <p>Share</p>
        </div>
      </div>
    </div>
  );
};

export default Post;
