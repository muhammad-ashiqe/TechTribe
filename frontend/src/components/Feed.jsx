import React from "react";
import CreatePost from "./CreatePost";
import Post from "./Post";

const Feed = () => {
  return (
    <>
      {/* Post Create Section */}
      <CreatePost />

      {/* Feed Section */}
      <div className="feed w-full py-4 bg-black roundedt-t-2xl min-h-[80vh]">
        {/*1st post */}
        <Post />
      </div>
    </>
  );
};

export default Feed;
