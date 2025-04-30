import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import CreatePost from "./CreatePost";
import Post from "./Post";
import { SocialContext } from "../context/context";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const {baseUrl,token} = useContext(SocialContext)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/post/getAllPost`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Send token to backend
            },
          }
        );
        // console.log(response.data);
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, [token]);

  return (
    <>
      <CreatePost />
      <div className="feed w-full py-4 bg-black rounded-t-2xl min-h-[80vh]">
        {posts.length > 0 ? (
          posts.map((post) => <Post key={post.id} post={post} />)
        ) : (
          <p className="text-white text-center">No posts available</p>
        )}
      </div>
    </>
  );
};
export default Feed;
